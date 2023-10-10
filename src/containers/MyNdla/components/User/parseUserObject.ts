/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import groupBy from 'lodash/groupBy';
import { FeideGoGroup, FeideGrep, FeideGroup, FeideOrg, FeideUserApiType } from './apiTypes';

type GoGroupType = 'basic' | 'teaching' | 'other';

/**
 * The keys come from:
 *  https://docs.feide.no/reference/apis/groups_api/groups_data_model/primary_and_secondary_education_groups.html?highlight=gogroup#specific-attributes-for-fc-gogroup
 */
const goGroupTypeMap: Record<'a' | 'b' | 'u', GoGroupType> = {
  a: 'other',
  b: 'basic',
  u: 'teaching',
};

/**
 * @param groups GoGroups to be mapped to specific GoGroupType
 * @returns GoGroups mapped to GoGroupType. basic, teaching and other..
 */
const createGroupings = (groups: FeideGoGroup[]) => {
  return groups.reduce<Record<GoGroupType, FeideGoGroup[]>>(
    (acc, curr) => {
      const type = goGroupTypeMap[curr.go_type];
      if (!acc[type]) return acc;

      acc[type] = acc[type].concat(curr);
      return acc;
    },
    {
      basic: [],
      teaching: [],
      other: [],
    },
  );
};

/**
 * @param groups GoGroups to be mapped to root/child relations.
 * @returns An object containing root groups mapped with children.
 */
const parseOrgs = (groups: FeideGroup[]) => {
  const [roots, children, grep] = groups.reduce<[FeideOrg[], FeideGoGroup[], FeideGrep[]]>(
    (acc, curr) => {
      if (curr.type === 'fc:org') {
        return [acc[0].concat(curr), acc[1], acc[2]];
      } else if (curr.type === 'fc:gogroup') {
        return [acc[0], acc[1].concat(curr), acc[2]];
      } else {
        return [acc[0], acc[1], acc[2].concat(curr)];
      }
    },
    [[], [], []],
  );

  const childrenByParentId = groupBy(children, (c) => c.parent);
  const rootsWithChildren = roots.map((root) => ({ ...root, children: childrenByParentId[root.id] ?? [] }));

  return {
    grepCodes: grep,
    roots: rootsWithChildren.map((root) => ({
      ...root,
      children: createGroupings(root.children),
    })),
  };
};

/**
 * @param user A user object coming from the API
 * @returns A user object parsed in a presentable way to be handled by i.e UserInfo component.
 */
export const parseUserObject = (user: FeideUserApiType) => {
  const { roots, grepCodes } = parseOrgs(user.groups);

  return {
    uid: user.uid,
    eduPersonAffiliation: user.eduPersonAffiliation,
    displayName: user.displayName,
    mail: user.mail,
    organizations: roots,
    grepCodes,
  };
};
