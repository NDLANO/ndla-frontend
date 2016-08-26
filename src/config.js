/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const environment = {
  development: {
    isProduction: false,
  },
  production: {
    isProduction: true,
  },
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.NDLA_FRONTENTD_HOST || 'localhost',
  port: process.env.NDLA_FRONTENTD_PORT || '3000',
  googleTagMangerId: process.env.GOOGLE_TAG_MANGER_ID || undefined,
  ndlaApiUrl: process.env.NDLA_API_URL || 'http://api.test.ndla.no',
  ndlaApiKey: process.env.NDLA_API_KEY || 'ndlalearningpathfrontend',
  app: {
    title: 'NDLA',
    head: {
      meta: [
        { name: 'description', content: 'NDLA meta description' },
        { property: 'og:site_name', content: 'NDLA' },
      ],
    },
  },

}, environment);
