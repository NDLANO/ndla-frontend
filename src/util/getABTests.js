/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cleanupExperiments } from '@ndla/abtest';
import { getCookie } from './cookieHandler';

export const NDLA_ABTEST_COOKIE_KEY = 'NDLA_ABTEST';

async function fetchExperimentsFromManagementAPI() {
  return new Promise(resolve => setTimeout(resolve, 200)).then(() => (
    [
      {
        id: 'PNJbRd6nRBia3d2I0YIRXg',
        variations: [
          {
            name: '',
            weight: 0.25
          },
          {
            name: 'titleVariantA',
            weight: 0.25
          },
          {
            name: 'titleVariantB',
            weight: 0.25
          },
          {
            name: 'titleVariantC',
            weight: 0.25
          }
        ]
      }
    ]
  ))
}

async function fetchExperiments(req) {
  /*
    FOR DEMO PURPOSES USE FAKE DATA FETCHING WITH GA MANAGEMENT LIST
  */
  const cookies = JSON.parse(getCookie(NDLA_ABTEST_COOKIE_KEY, req.headers.cookie));
  console.log('cookies was', cookies);
  const results = await fetchExperimentsFromManagementAPI();
  const useExperiments = cleanupExperiments(results, cookies);
  return new Promise(resolve => setTimeout(resolve, 500)).then(() => (
    useExperiments
  ));
};

export default fetchExperiments;