/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FeideUserApiType } from '../../interfaces';
import { getAffiliationRoleOrDefault } from '../apiHelpers';

const feideUser: FeideUserApiType = {
  cn: ['User User'],
  displayName: 'User User',
  eduPersonAffiliation: [],
  eduPersonPrimaryAffiliation: 'member',
  eduPersonPrincipalName: 'user@test.no',
  givenName: ['User'],
  mail: ['user@test.no'],
  sn: ['User'],
  uid: ['user'],
  groups: [],
};

test('That role is correctly fetched', () => {
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['employee'],
    }),
  ).toBe('employee');
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['faculty'],
    }),
  ).toBe('employee');
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['staff'],
    }),
  ).toBe('employee');
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['student'],
    }),
  ).toBe('student');
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['member'],
    }),
  ).toBe('student');

  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['employee', 'faculty', 'staff'],
    }),
  ).toBe('employee');
  expect(
    getAffiliationRoleOrDefault({
      ...feideUser,
      eduPersonAffiliation: ['employee', 'faculty', 'staff', 'student'],
    }),
  ).toBe('student');
});
