/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { matchPath } from 'react-router-dom';
import parseUrl from 'parse-url';
import { isValidLocale } from '../i18n';
import {
  RESOURCE_PAGE_PATH,
  PLAIN_ARTICLE_PAGE_PATH,
  TOPIC_PATH,
} from '../constants';

function matchUrl(pathname, type, lang = false) {
  if (type === 'article') {
    return matchPath(
      pathname,
      lang ? `/:lang${PLAIN_ARTICLE_PAGE_PATH}` : PLAIN_ARTICLE_PAGE_PATH,
    );
  }
  let match = matchPath(
    pathname,
    lang ? `/:lang${RESOURCE_PAGE_PATH}` : RESOURCE_PAGE_PATH,
  );
  console.log('nfhfhr', match);
  if (match) {
    return match;
  }

  return matchPath(pathname, lang ? `/:lang${TOPIC_PATH}` : TOPIC_PATH);
}

export function parseAndMatchUrl(url) {
  const { pathname } = parseUrl(url);
  const paths = pathname.split('/');
  paths[1] = paths[1] === 'unknown' ? 'nb' : paths[1];
  const path = paths.join('/');

  if (isValidLocale(paths[1])) {
    return matchUrl(path, paths[2], true);
  }
  return matchUrl(path, paths[1], false);
}
