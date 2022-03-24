/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from '../config';
import { PROGRAMME_PATH } from '../constants';
import { programmes } from '../data/programmes';

const programmeSitemap = (): string => {
  const baseUrl = `${config?.ndlaFrontendDomain}${PROGRAMME_PATH}/`;
  const slugs = programmes.map(p => `${baseUrl}${p.url['nb']}\n`);
  return slugs.join('');
};

export default programmeSitemap;
