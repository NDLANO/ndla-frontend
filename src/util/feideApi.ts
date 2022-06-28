/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FeideUserApiType, FeideUser, FeideGroup } from '@ndla/ui';
import {
  fetchWithFeideAuthorization,
  resolveJsonOrRejectWithError,
} from './apiHelpers';

export const fetchFeideGroups = (): Promise<FeideGroup[] | undefined> => {
  return fetchWithFeideAuthorization(
    `https://groups-api.dataporten.no/groups/me/groups`,
  ).then(a => resolveJsonOrRejectWithError<FeideGroup[]>(a));
};

export const fetchFeideUser = (): Promise<FeideUser | undefined> => {
  return fetchWithFeideAuthorization(
    `https://api.dataporten.no/userinfo/v1/userinfo`,
  ).then(u => resolveJsonOrRejectWithError<FeideUser>(u));
};

export const fetchFeideUserWithGroups = async (): Promise<
  FeideUserApiType | undefined
> => {
  const user = await fetchFeideUser();
  const groups = await fetchFeideGroups();
  const primarySchool =
    groups?.length === 1
      ? groups[0]
      : groups?.find(g => g.membership.primarySchool);
  return user && groups ? { ...user, groups, primarySchool } : undefined;
};
