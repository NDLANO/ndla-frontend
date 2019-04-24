/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cleanupExperiments } from '@ndla/abtest';

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
            name: 'GUL KNAPP',
            // url: '',
            // status: 'ACTIVE',
            weight: 0.3333333333333333
          },
          {
            name: 'RØD KNAPP',
            // url: '',
            // status: 'ACTIVE',
            weight: 0.3333333333333333
          }
        ]
      }
    ]
  ))
}

async function fetchExperiments(req) {
  const cookies = req.cookie ? JSON.parse(req.cookie) : null;
  /*
    FOR DEMO PURPOSES USE FAKE DATA FETCHING WITH GA MANAGEMENT LIST
  */
  const results = await fetchExperimentsFromManagementAPI();
  const useExperiments = cleanupExperiments(results, cookies);
  return new Promise(resolve => setTimeout(resolve, 500)).then(() => (
    useExperiments
  ));
};

export default fetchExperiments;