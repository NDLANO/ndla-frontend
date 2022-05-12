/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import { match as RouterMatchType } from 'react-router';
import { isValidLocale } from '../i18n';
import {
  PLAIN_ARTICLE_PAGE_PATH,
  RESOURCE_PAGE_PATH,
  TOPIC_PATH,
  PLAIN_ARTICLE_IFRAME_PATH,
  RESOURCE_ARTICLE_IFRAME_PATH,
  TOPIC_ARTICLE_IFRAME_PATH,
} from '../constants';

function matchUrl<Params>(
  pathname: string,
  lang: boolean = false,
): RouterMatchType<Params> | null {
  const possiblePaths = [
    lang ? `/:lang${RESOURCE_PAGE_PATH}` : RESOURCE_PAGE_PATH,
    lang ? `/:lang${TOPIC_PATH}` : TOPIC_PATH,
    lang ? `/:lang${PLAIN_ARTICLE_PAGE_PATH}` : PLAIN_ARTICLE_PAGE_PATH,
    lang ? `/:lang${PLAIN_ARTICLE_IFRAME_PATH}` : PLAIN_ARTICLE_IFRAME_PATH,
    lang
      ? `/:lang${RESOURCE_ARTICLE_IFRAME_PATH}`
      : RESOURCE_ARTICLE_IFRAME_PATH,
    lang ? `/:lang${TOPIC_ARTICLE_IFRAME_PATH}` : TOPIC_ARTICLE_IFRAME_PATH,
  ];

  for (let i = 0; i < possiblePaths.length; i++) {
    const attempt = possiblePaths[i] ?? '';
    const m = matchPath<Params>(pathname, attempt);
    if (m) {
      return m;
    }
  }

  return null;
}

export function parseAndMatchUrl<Params>(
  url: string,
  ignoreLocale: boolean = false,
): RouterMatchType<Params> | null {
  const { pathname } = new URL(url);
  let paths = pathname.split('/');
  if (paths[1]) {
    paths[1] = paths[1] === 'unknown' ? 'nb' : paths[1];
  }
  if (ignoreLocale && isValidLocale(paths[1])) paths.splice(1, 1);
  const path = paths.join('/');

  if (isValidLocale(paths[1])) {
    return matchUrl<Params>(path, true);
  }
  return matchUrl<Params>(path, false);
}
