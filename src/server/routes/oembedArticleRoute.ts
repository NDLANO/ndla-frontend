/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import express from 'express';
import { PathMatch } from 'react-router-dom';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../../statusCodes';
import { getArticleIdFromResource } from '../../containers/Resources/resourceHelpers';
import {
  fetchResource,
  fetchTopic,
} from '../../containers/Resources/resourceApi';
import config from '../../config';
import handleError from '../../util/handleError';
import { fetchArticle } from '../../containers/ArticlePage/articleApi';
import { parseOembedUrl } from '../../util/urlHelper';
import { createApolloClient } from '../../util/apiHelpers';
import { embedOembedQuery } from '../../queries';
import {
  GQLEmbedOembedQuery,
  GQLEmbedOembedQueryVariables,
} from '../../graphqlTypes';

function getOembedObject(req: express.Request, title?: string, html?: string) {
  return {
    data: {
      type: 'rich',
      version: '1.0', // oEmbed version
      height: req.query.height || 480,
      width: req.query.width || 854,
      title,
      html,
    },
  };
}

type MatchParams = 'resourceId' | 'topicId' | 'lang' | 'articleId';

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

const getHTMLandTitle = async (
  match: PathMatch<MatchParams>,
  req: express.Request,
) => {
  const {
    params: { resourceId, topicId, lang = config.defaultLocale },
  } = match;
  if (!topicId && !resourceId) {
    return {};
  }
  if (topicId && !resourceId) {
    const topic = await fetchTopic(`urn:topic${topicId}`, lang);
    const articleId = getArticleIdFromResource(topic);
    return {
      title: topic.name,
      html: `<iframe aria-label="${topic.name}" src="${
        config.ndlaFrontendDomain
      }/article-iframe/${lang}/${topic.id}/${articleId}" height="${
        req.query.height || 480
      }" width="${
        req.query.width || 854
      }" frameborder="0" allowFullscreen="" />`,
    };
  }

  const resource = await fetchResource(`urn:resource${resourceId}`, lang);
  const articleId = getArticleIdFromResource(resource);
  return {
    title: resource.name,
    html: `<iframe aria-label="${resource.name}" src="${
      config.ndlaFrontendDomain
    }/article-iframe/${lang}/${resource.id}/${articleId}" height="${
      req.query.height || 480
    }" width="${req.query.width || 854}" frameborder="0" allowFullscreen="" />`,
  };
};

export const getEmbedTitle = (type: string, data: GQLEmbedOembedQuery) => {
  if (type === 'concept') {
    return data.resourceEmbed.meta.concepts?.[0]?.title ?? '';
  } else if (type === 'audio') {
    return (
      data.resourceEmbed.meta.podcasts?.[0]?.title ??
      data.resourceEmbed.meta.audios?.[0]?.title ??
      ''
    );
  } else if (type === 'video') {
    return data.resourceEmbed.meta.brightcoves?.[0]?.title ?? '';
  } else {
    return data.resourceEmbed.meta.images?.[0]?.title ?? '';
  }
};

export const getEmbedObject = async (
  lang: string,
  embedId: string,
  embedType: string,
  req: express.Request,
) => {
  const client = getApolloClient(lang);

  const embed = await client.query<
    GQLEmbedOembedQuery,
    GQLEmbedOembedQueryVariables
  >({
    query: embedOembedQuery,
    variables: {
      id: embedId,
      type: embedType,
    },
  });
  const title = getEmbedTitle(embedType, embed.data);
  return getOembedObject(
    req,
    title,
    `<iframe aria-label="${title}" src="${
      config.ndlaFrontendDomain
    }/embed-iframe/${lang}/${embedType}/${embedId}" height="${
      req.query.height || 480
    }" width="${req.query.width || 854}" frameborder="0" allowFullscreen="" />`,
  );
};

export async function oembedArticleRoute(req: express.Request) {
  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Missing url param.',
    };
  }

  const match = parseOembedUrl(url);
  if (!match) {
    return {
      status: BAD_REQUEST,
      data: 'Bad request. Invalid url.',
    };
  }

  const {
    params: {
      resourceId,
      audioId,
      conceptId,
      videoId,
      imageId,
      topicId,
      lang = config.defaultLocale,
    },
  } = match;
  try {
    if (conceptId) {
      return await getEmbedObject(lang, conceptId, 'concept', req);
    } else if (audioId) {
      return await getEmbedObject(lang, audioId, 'audio', req);
    } else if (videoId) {
      return await getEmbedObject(lang, videoId, 'video', req);
    } else if (imageId) {
      return await getEmbedObject(lang, imageId, 'image', req);
    } else if (!resourceId && !topicId) {
      const {
        params: { articleId },
      } = match;
      const article = await fetchArticle(articleId, lang);
      return getOembedObject(
        req,
        article.title.title,
        `<iframe aria-label="${article.title.title}" src="${
          config.ndlaFrontendDomain
        }/article-iframe/${lang}/article/${articleId}" height="${
          req.query.height || 480
        }" width="${
          req.query.width || 854
        }" frameborder="0" allowFullscreen="" />`,
      );
    }
    const { html, title } = await getHTMLandTitle(match, req);
    return getOembedObject(req, title, html);
  } catch (error) {
    handleError(error);

    const typedError = error as { status?: number };
    const status = typedError.status || INTERNAL_SERVER_ERROR;

    return {
      status,
      data: 'Internal server error',
    };
  }
}
