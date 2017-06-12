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
import { titleI18N } from '../../src/util/i18nFieldFinder';

export function iframeArticleRoute(req, res, token) {
  const lang = getHtmlLang(defined(req.params.lang, ''));
  const articleId = req.params.id;
  fetchArticle(articleId, lang, token.access_token)
    .then(article => {
      res.send(
        htmlTemplate(
          lang,
          article.content,
          article.introduction,
          titleI18N(article, lang, true),
        ),
      );
      res.end();
    })
    .catch(error => {
      res.status(error.status).send(htmlErrorTemplate(lang, error));
    });
}
