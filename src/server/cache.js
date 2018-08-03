/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Inspired by https://github.com/GlobalDigitalLibraryio/gdl-frontend/blob/master/packages/gdl-frontend/server/cache.js
 */

import LRUCache from 'lru-cache';

const ssrCache = new LRUCache({
  max: 200,
  maxAge: 1000 * 60 * 10, // 10 minutes
});

const isDev = process.env.NODE_ENV !== 'production';

/**
 *  Determine if the page is something we want to cache
 */
function isCacheable(req) {
  // Do not cache when developing
  if (isDev) {
    return false;
    // Do not bother caching search.
  }
  if (req.path.startsWith('/search')) {
    return false;
  }

  return true;
}

export async function renderAndCache(req, res, route) {
  const cacheKey = req.path;
  const canUseCache = isCacheable(req);
  let data;
  let status;

  // If the page is in the cache. Serve it
  if (canUseCache && ssrCache.has(cacheKey)) {
    res.setHeader('x-cache', 'HIT');
    ({ data, status } = ssrCache.get(cacheKey));
    return { res, data, status };
  }

  if (canUseCache) {
    // Cache the rendered result
    ({ data, status } = await route(req));

    // Skip the cache if something is wrong
    if (status !== 200) return { res, data, status };

    ssrCache.set(cacheKey, { data, status });
    res.setHeader('x-cache', 'MISS');
    return { res, data, status };
  }

  // No cache served
  ({ data, status } = await route(req));
  return { res, data, status };
}
