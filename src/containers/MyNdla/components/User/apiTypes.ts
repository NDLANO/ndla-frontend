/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

type OrgType =
  | 'higher_education'
  | 'primary_and_lower_secondary'
  | 'primary_and_lower_secondary_owner'
  | 'upper_secondary'
  | 'upper_secondary_owner';

export type AffiliationType = 'member' | 'student' | 'faculty' | 'staff' | 'affiliate' | 'employee';

export interface FeideMembershipType {
  basic: 'member' | 'admin' | 'owner'; // Basic membership role of user.
  affiliation?: AffiliationType[];
  primarySchool?: boolean;
  primaryAffiliation?: AffiliationType;
  displayName?: string;
}

interface FeideBaseGroup {
  id: string;
  type: 'fc:org' | 'fc:gogroup' | 'fc:grep';
  displayName: string;
  membership: FeideMembershipType;
}

export interface FeideOrg extends FeideBaseGroup {
  type: 'fc:org';
  orgType: OrgType[];
  norEduOrgNIN?: string;
  eduOrgLegalName?: string;
  mail?: string;
  parent?: string;
  public: boolean;
}

export interface FeideGoGroup extends FeideBaseGroup {
  type: 'fc:gogroup';
  notBefore: string;
  notAfter: string;
  go_type: 'b' | 'u' | 'a';
  parent: string;
  go_type_displayName: string;
  grep?: {
    displayName: string;
    code: string;
  };
}

export interface FeideGrep extends FeideBaseGroup {
  type: 'fc:grep';
  code: string;
  grep_type: 'aarstrinn' | 'fagkoder';
  public: boolean;
}

export type FeideGroup = FeideOrg | FeideGoGroup | FeideGrep;

export interface FeideUser {
  cn: string[];
  displayName: string;
  eduPersonAffiliation: AffiliationType[];
  eduPersonPrimaryAffiliation: AffiliationType;
  eduPersonPrincipalName: string;
  givenName: string[];
  mail?: string[];
  schacHomeOrganization?: string;
  sn: string[];
  uid: string[];
  preferredLanguage?: string;
  mobile?: string;
}

export interface FeideUserApiType extends FeideUser {
  groups: FeideGroup[];
  primarySchool?: FeideGroup;
  baseOrg?: FeideGroup;
}
