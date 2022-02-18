/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  fetchWithFeideAuthorization,
  resolveJsonOrRejectWithError,
} from './apiHelpers';

type OrgType =
  | 'higher_education'
  | 'primary_and_lower_secondary'
  | 'primary_and_lower_secondary_owner'
  | 'upper_secondary'
  | 'upper_secondary_owner';
type AffiliationType =
  | 'student'
  | 'faculty'
  | 'staff'
  | 'affiliate'
  | 'employee';

export interface FeideMembershipType {
  basic: 'member' | 'admin' | 'owner'; // Basic membership role of user.
  affiliation: AffiliationType[] | AffiliationType;
  primarySchool?: boolean;
  primaryAffiliation?: AffiliationType;
  displayName?: string;
}

export interface FeideGroupType {
  id: string;
  displayName: string;
  eduOrgLegalName: string;
  membership: FeideMembershipType;
  orgType: OrgType[];
  parent?: string;
}

export interface FeideUser {
  uid: string;
  displayName: string;
  eduPersonPrimaryAffiliation: string;
  mail?: string[];
}

export interface FeideUserWithGroups extends FeideUser {
  groups: FeideGroupType[];
  primarySchool?: FeideGroupType;
}

export const fetchFeideGroups = (): Promise<FeideGroupType[] | undefined> => {
  return fetchWithFeideAuthorization(
    `https://groups-api.dataporten.no/groups/me/groups`,
  ).then(a => resolveJsonOrRejectWithError<FeideGroupType[]>(a));
};

export const fetchFeideUser = (): Promise<FeideUser | undefined> => {
  return fetchWithFeideAuthorization(
    `https://api.dataporten.no/userinfo/v1/userinfo`,
  ).then(u => resolveJsonOrRejectWithError<FeideUser>(u));
};

export const fetchFeideUserWithGroups = async (): Promise<
  FeideUserWithGroups | undefined
> => {
  const user = await fetchFeideUser();
  const groups = await fetchFeideGroups();
  const primarySchool =
    groups?.length === 1
      ? groups[0]
      : groups?.find(g => g.membership.primarySchool);
  return user && groups ? { ...user, groups, primarySchool } : undefined;
};
