/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { getHtmlLang } from '../../src/i18n';
import { htmlTemplate, htmlErrorTemplate } from '../helpers/oembedHtmlTemplate';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { storeAccessToken } from '../../src/util/apiHelpers';

export async function iframeArticleRoute(req, res, token) {
  storeAccessToken(token.access_token);
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  try {
    const article = await fetchArticle(articleId, lang);
    res.send(htmlTemplate(lang, '', article.introduction, article.title));
    res.end();
  } catch (error) {
    console.log(error);
    res.status(error.status).send(htmlErrorTemplate(lang, error));
  }
}
