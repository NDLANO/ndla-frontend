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

const fetchExperimentsFromManagementAPI = async (req) => {
  const url = `${req.protocol}://${req.get('host')}${COLLECT_EXPERIMENTS}` // Settes i config i stedet?

  const response = await fetch(url)
  const data = await response.json();
  return data;
};

const fetchExperiments = async req => {
  const cookies = JSON.parse(
    getCookie(NDLA_ABTEST_COOKIE_KEY, req.headers.cookie),
  );
  const results = await fetchExperimentsFromManagementAPI(req);
  const experiments = cleanupExperiments(results, cookies);
  return experiments;
};

export default fetchExperiments;
