/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from "express";
import { PathMatch } from "react-router-dom";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Node } from "@ndla/types-taxonomy";
import config from "../../config";
import { fetchArticle } from "../../containers/ArticlePage/articleApi";
import { getArticleIdFromResource } from "../../containers/Resources/resourceHelpers";
import { GQLEmbedOembedQuery, GQLEmbedOembedQueryVariables } from "../../graphqlTypes";
import { embedOembedQuery } from "../../queries";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../../statusCodes";
import { apiResourceUrl, createApolloClient, resolveJsonOrRejectWithError } from "../../util/apiHelpers";
import handleError from "../../util/handleError";
import { parseOembedUrl } from "../../util/urlHelper";

const baseUrl = apiResourceUrl("/taxonomy/v1");

const fetchNode = (id: string, locale: string): Promise<Node> =>
  fetch(`${baseUrl}/nodes/${id}?language=${locale}`).then((r) => resolveJsonOrRejectWithError(r) as Promise<Node>);

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
  };
}

type MatchParams = "resourceId" | "topicId" | "lang" | "articleId";

let apolloClient: ApolloClient<NormalizedCacheObject>;
let storedLocale: string;

const getApolloClient = (locale: string) => {
  if (apolloClient && locale === storedLocale) {
    return apolloClient;
  } else {
    apolloClient = createApolloClient(locale);
    storedLocale = locale;
    return apolloClient;
  }
};

const getHTMLandTitle = async (match: PathMatch<MatchParams>, req: express.Request) => {
  const {
    params: { resourceId, topicId, lang = config.defaultLocale },
  } = match;
  if (!topicId && !resourceId) {
    return {};
  }

  const height = req.query.height || 480;
  const width = req.query.width || 854;
  const nodeId = topicId && !resourceId ? `urn:topic${topicId}` : `urn:resource${resourceId}`;
  const node = await fetchNode(nodeId, lang);
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

const getEmbedObject = async (lang: string, embedId: string, embedType: string, req: express.Request) => {
  const client = getApolloClient(lang);

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

  const match = parseOembedUrl(url);
  if (!match) {
    return {
      status: BAD_REQUEST,
      data: "Bad request. Invalid url.",
    };
  }

  const {
    params: { resourceId, audioId, conceptId, h5pId, videoId, imageId, topicId, lang = config.defaultLocale },
  } = match;
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
    } else if (!resourceId && !topicId) {
      const {
        params: { articleId },
      } = match;
      const article = await fetchArticle(articleId, lang);
      const height = req.query.height || 480;
      const width = req.query.width || 854;
      const html = `<iframe aria-label="${article.title.title}" src="${config.ndlaFrontendDomain}/article-iframe/${lang}/article/${articleId}" height="${height}" width="${width}" frameborder="0" allowFullscreen="" />`;
      return getOembedObject(req, article.title.title, html);
    }
    const { html, title } = await getHTMLandTitle(match, req);
    return getOembedObject(req, title, html);
  } catch (error) {
    handleError(error);

    const typedError = error as { status?: number };
    const status = typedError.status || INTERNAL_SERVER_ERROR;

    return {
      status,
      data: typedError.status === 404 ? "Not found" : "Internal server error",
    };
  }
}
