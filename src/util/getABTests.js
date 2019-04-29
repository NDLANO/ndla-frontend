/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cleanupExperiments } from '@ndla/abtest';
import { getCookie } from './cookieHandler';
import { COLLECT_EXPERIMENTS } from '../constants';

export const NDLA_ABTEST_COOKIE_KEY = 'NDLA_ABTEST';

async function fetchExperimentsFromManagementAPI() {
  const response = await fetch(COLLECT_EXPERIMENTS);
  const data = await response.json();
  return data;
}

async function fetchExperiments(req) {
  /*
    FOR DEMO PURPOSES WE USE LOCALHOST 4000
  */
  const cookies = JSON.parse(getCookie(NDLA_ABTEST_COOKIE_KEY, req.headers.cookie));
  const results = await fetchExperimentsFromManagementAPI();
  const useExperiments = cleanupExperiments(results.experiments, null);
  return { useExperiments, googleAccountId: results.googleAccountId };
};

export default fetchExperiments;