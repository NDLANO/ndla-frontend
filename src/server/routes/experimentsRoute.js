/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { google } from 'googleapis';
import serverConfig from '../../config';

const config = serverConfig.gaExperiments;
 
const accountId = config.GOOGLE_ACCOUNT_ID;
const webPropertyId = config.GOOGLE_WEB_PROPERTY_ID;
const profileId = config.GOOGLE_PROFILE_ID;
const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];

const analytics = google.analytics({
  version: 'v3'
});

const getAuth = async () => {
  const auth = await google.auth.getClient({
    scopes
  });

  return auth;
};

const filterAndMapExperiments = experiments =>
  experiments
    .filter(({ status }) => status === 'RUNNING')
    .map(({ id, variations }) => ({
      id,
      variations: variations.map(({ name, weight }) => ({
        name,
        weight
      }))
    }));

const getExperimentList = async () => {
  const auth = await getAuth();
  const result = await analytics.management.experiments.list({
    accountId,
    webPropertyId,
    profileId,
    auth
  });

  if (!(result.data && result.data.items)) {
    throw new Error('No experiments or invalid data');
  }

  return filterAndMapExperiments(result.data.items);
};

export const experimentsRoute = async (req) => {
  const experiments = await getExperimentList();
  return {
    data: experiments,
    status: 200
  }
}
