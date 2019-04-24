/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cleanupExperiments } from '@ndla/abtest';

export const NDLA_ABTEST_COOKIE_KEY = 'NDLA_ABTEST';

async function fetchExperimentsFromManagementAPI() {
  return new Promise(resolve => setTimeout(resolve, 200)).then(() => (
    [
      {
        id: 'PNJbRd6nRBia3d2I0YIRXg',
        variations: [
          {
            name: '',
            // url: '',
            // status: 'ACTIVE',
            weight: 0.3333333333333333
          },
          {
            name: 'YELLOW',
            // url: '',
            // status: 'ACTIVE',
            weight: 0.3333333333333333
          },
          {
            name: 'RED',
            // url: '',
            // status: 'ACTIVE',
            weight: 0.3333333333333333
          }
        ]
      }
    ]
  ))
}

const getCookie = (cookieName, cookies) => {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${cookieName}=`);
  if (parts.length == 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

async function fetchExperiments(req) {
  /*
    FOR DEMO PURPOSES USE FAKE DATA FETCHING WITH GA MANAGEMENT LIST
  */
  const cookies = JSON.parse(getCookie(NDLA_ABTEST_COOKIE_KEY, req.headers.cookie));
  const results = await fetchExperimentsFromManagementAPI();
  const useExperiments = cleanupExperiments(results, cookies);
  return new Promise(resolve => setTimeout(resolve, 500)).then(() => (
    useExperiments
  ));
};

export default fetchExperiments;