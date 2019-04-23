/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { cleanupExperiments } from '@ndla/abtest';

async function fetchExperimentsFromManagementAPI(params) {
  console.log(params);
  return new Promise(resolve => setTimeout(resolve, 200)).then(() => (
    {
      items: [
        {
          id: 'experimentId1',
          kind: 'analytics#experiment',
          selfLink: 'string',
          accountId: 'string',
          webPropertyId: 'string',
          internalWebPropertyId: 'string',
          profileId: 'string',
          name: 'string',
          description: 'string',
          created: 'datetime',
          updated: 'datetime',
          objectiveMetric: 'string',
          optimizationType: 'string',
          status: 'string',
          winnerFound: false,
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          reasonExperimentEnded: 'string',
          rewriteVariationUrlsAsOriginal: 'boolean',
          winnerConfidenceLevel: 0.7,
          minimumExperimentLengthInDays: 'integer',
          trafficCoverage: 'double',
          equalWeighting: true,
          snippet: 'string',
          variations: [
            {
              name: 'default',
              url: 'string',
              status: 'string',
              weight: 0.5,
              won: false,
            },
            {
              name: 'blue',
              url: 'string',
              status: 'string',
              weight: 0.5,
              won: false,
            }
          ],
          servingFramework: 'string',
          editableInGaUi: false,
          parentLink: {
            type: 'analytics#profile',
            href: 'string'
          }
        }
      ]
    }
  ))
}


async function fetchExperiments(req) {
  const cookies = req.cookie ? JSON.parse(req.cookie) : null;
  /*
    FOR DEMO PURPOSES USE FAKE DATA FETCHING WITH GA MANAGEMENT LIST
  */

  const results = await fetchExperimentsFromManagementAPI({
    accountId: '74405776',
    webPropertyId: 'UA-74405776-4',
    profileId: '7654321',
  });

  console.log('results', results);
  console.log(cookies);

  const useExperiments = cleanupExperiments(results.items, cookies);
  console.log(useExperiments);
  return new Promise(resolve => setTimeout(resolve, 500)).then(() => (
    useExperiments
  ));
};

export default fetchExperiments;