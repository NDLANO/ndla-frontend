/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import { Params } from "react-router-dom";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { Node } from "@ndla/types-taxonomy";
import config from "../../config";
import { fetchArticle } from "../../containers/ArticlePage/articleApi";
import { getArticleIdFromResource } from "../../containers/Resources/resourceHelpers";
import { GQLEmbedOembedQuery, GQLEmbedOembedQueryVariables } from "../../graphqlTypes";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from "../../statusCodes";
import { apiResourceUrl, createApolloClient, resolveJsonOrRejectWithError } from "../../util/apiHelpers";
import handleError from "../../util/handleError";
import { parseOembedUrl } from "../../util/urlHelper";

const baseUrl = apiResourceUrl("/taxonomy/v1");

const fetchNode = (id: string, locale: string): Promise<Node> =>
  fetch(`${baseUrl}/nodes/${id}?language=${locale}`).then((r) => resolveJsonOrRejectWithError(r) as Promise<Node>);

const queryNodeByContexts = (contextId: string, locale: string): Promise<Node> =>
  fetch(`${baseUrl}/nodes?contextId=${contextId}&language=${locale}`)
    .then((r) => resolveJsonOrRejectWithError(r) as Promise<Node[]>)
    .then((nodes) => nodes[0] || Promise.reject(new Error("No node found")));

function getOembedObject(req: express.Request, title?: string, html?: string) {
  return {
    data: {
      type: "rich",
      version: "1.0", // oEmbed version
      height: req.query.height || 480,
      width: req.query.width || 854,
      title,
      html,
    },
    status: 200,
  };
}

type MatchParams = "contextId" | "resourceId" | "topicId" | "lang" | "articleId" | "nodeId";

let apolloClient: ApolloClient<NormalizedCacheObject>;
let storedLocale: string;

const getApolloClient = (locale: string, req: express.Request) => {
  if (apolloClient && locale === storedLocale) {
    return apolloClient;
  } else {
    apolloClient = createApolloClient(locale, undefined, req.path);
    storedLocale = locale;
    return apolloClient;
  }
};

const getHTMLandTitle = async (match: Params<MatchParams>, req: express.Request) => {
  const { contextId, resourceId, topicId, lang = config.defaultLocale } = match;
  if (!contextId && !topicId && !resourceId && !match.nodeId) {
    return {};
  }

  const height = req.query.height || 480;
  const width = req.query.width || 854;
  const nodeId = topicId && !resourceId ? topicId : resourceId;
  const node = contextId
    ? await queryNodeByContexts(contextId, lang)
    : await fetchNode(match.nodeId ? match.nodeId : nodeId!, lang);
  if (node.contentUri?.includes("learningpath")) {
    return {};
  }
  const articleId = getArticleIdFromResource(node);
  return {
    title: node.name,
    html: `<iframe aria-label="${node.name}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${node.id}/${articleId}" height="${height}" width="${width}" frameborder="0" allowFullscreen="" />`,
  };
};

const getEmbedTitle = (type: string, data: GQLEmbedOembedQuery) => {
  if (type === "concept") {
    return data.resourceEmbed.meta.concepts?.[0]?.title ?? "";
  } else if (type === "audio") {
    return data.resourceEmbed.meta.podcasts?.[0]?.title ?? data.resourceEmbed.meta.audios?.[0]?.title ?? "";
  } else if (type === "video") {
    return data.resourceEmbed.meta.brightcoves?.[0]?.title ?? "";
  } else {
    return data.resourceEmbed.meta.images?.[0]?.title ?? "";
  }
};

const embedOembedQuery = gql`
  query embedOembed($id: String!, $type: String!) {
    resourceEmbed(id: $id, type: $type) {
      meta {
        images {
          title
        }
        concepts {
          title
        }
        audios {
          title
        }
        podcasts {
          title
        }
        brightcoves {
          title
        }
      }
    }
  }
`;

const getEmbedObject = async (lang: string, embedId: string, embedType: string, req: express.Request) => {
  const client = getApolloClient(lang, req);

  const embed = await client.query<GQLEmbedOembedQuery, GQLEmbedOembedQueryVariables>({
    query: embedOembedQuery,
    variables: { id: embedId, type: embedType },
  });
  const title = getEmbedTitle(embedType, embed.data);
  const height = req.query.height || 480;
  const width = req.query.width || 854;
  const html = `<iframe aria-label="${title}" src="${config.ndlaFrontendDomain}/embed-iframe/${lang}/${embedType}/${embedId}" height="${height}" width="${width}" frameborder="0" allowFullscreen="" />`;
  return getOembedObject(req, title, html);
};

export async function oembedArticleRoute(req: express.Request) {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return {
      status: BAD_REQUEST,
      data: "Bad request. Missing url param.",
    };
  }

  const params = parseOembedUrl(url);
  if (!params) {
    return {
      status: NOT_FOUND,
      data: "Bad request. Url not recognized",
    };
  }

  const {
    contextId,
    resourceId,
    audioId,
    conceptId,
    h5pId,
    videoId,
    imageId,
    topicId,
    nodeId,
    lang = config.defaultLocale,
  } = params;
  try {
    if (conceptId) {
      return await getEmbedObject(lang, conceptId, "concept", req);
    } else if (audioId) {
      return await getEmbedObject(lang, audioId, "audio", req);
    } else if (videoId) {
      return await getEmbedObject(lang, videoId, "video", req);
    } else if (imageId) {
      return await getEmbedObject(lang, imageId, "image", req);
    } else if (h5pId) {
      return await getEmbedObject(lang, h5pId, "h5p", req);
    } else if (!resourceId && !topicId && !nodeId && !contextId) {
      const { articleId } = params;
      const article = await fetchArticle(articleId!, lang);
      const height = req.query.height || 480;
      const width = req.query.width || 854;
      const html = `<iframe aria-label="${article.title.title}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/article/${articleId}" height="${height}" width="${width}" frameborder="0" allowFullscreen="" />`;
      return getOembedObject(req, article.title.title, html);
    }
    const { html, title } = await getHTMLandTitle(params, req);
    if (!html && !title) {
      return {
        status: NOT_FOUND,
        data: "Not found",
      };
    }
    return getOembedObject(req, title, html);
  } catch (error) {
    handleError(error, req.path);

    const typedError = error as { status?: number; message?: string };
    const status = typedError.status || INTERNAL_SERVER_ERROR;

    const data: Record<number, string> = {
      404: "Not found",
      410: "Gone",
      500: "Internal server error",
    };

    return {
      status,
      data: data[status] || typedError.message || "Internal server error",
    };
  }
}
