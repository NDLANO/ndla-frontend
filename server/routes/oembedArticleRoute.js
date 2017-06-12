/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isValidLocale } from '../../src/i18n';
import { fetchArticle } from '../../src/containers/ArticlePage/articleApi';
import { titleI18N } from '../../src/util/i18nFieldFinder';
import config from '../../src/config';

export function oembedArticleRoute(req, res, token) {
  res.setHeader('Content-Type', 'application/json');
  // http://ndla-frontend.test.api.ndla.no/article/3023
  const url = req.query.url;
  if (!url) {
    res.status(404).json({ status: 404, text: 'Url not found' });
  }
  const paths = url.split('/');
  const articleId = paths.length > 5 ? paths[5] : paths[4];
  const lang = paths.length > 2 && isValidLocale(paths[3]) ? paths[3] : 'nb';
  fetchArticle(articleId, lang, token.access_token)
    .then(article => {
      res.json({
        type: 'rich',
        version: '1.0', // oEmbed version
        height: req.query.height ? req.query.height : 800,
        width: req.query.width ? req.query.width : 800,
        title: titleI18N(article, lang, true),
        html: `<iframe src="${config.ndlaFrontendDomain}/article-iframe/${lang}/${articleId}" frameborder="0" />`,
      });
    })
    .catch(error => {
      res.status(error.status).json(error.message);
    });
}
