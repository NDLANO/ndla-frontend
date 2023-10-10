/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FeideUserApiType } from '../apiTypes';
import { parseUserObject } from '../parseUserObject';

const feideUserLaerer: FeideUserApiType = {
  cn: ['David LærerVGS Jonsen'],
  displayName: 'David LærerVGS Jonsen',
  eduPersonAffiliation: ['member', 'employee', 'faculty'],
  eduPersonPrimaryAffiliation: 'employee',
  eduPersonPrincipalName: 'david_laerervgs@spusers.feide.no',
  givenName: ['David LærerVGS'],
  mail: ['david_laerervgs@feide.no'],
  sn: ['Jonsen'],
  uid: ['david_laerervgs'],
  groups: [
    {
      id: 'fc:org:spusers.feide.no',
      displayName: 'Rogn fylkeskommune',
      type: 'fc:org',
      public: false,
      membership: {
        basic: 'admin',
        affiliation: ['member', 'employee', 'faculty'],
        primaryAffiliation: 'employee',
        displayName: 'Akademisk ansatt',
      },
      orgType: ['higher_education', 'upper_secondary_owner', 'primary_and_lower_secondary_owner'],
      norEduOrgNIN: 'NO956326503',
      eduOrgLegalName: 'Rogn fylkeskommune',
      mail: 'support@feide.no',
    },
    {
      id: 'fc:org:spusers.feide.no:unit:NO956326504',
      parent: 'fc:org:spusers.feide.no',
      displayName: 'Lind VGS',
      type: 'fc:org',
      public: false,
      membership: {
        basic: 'member',
        primarySchool: true,
      },
      orgType: ['primary_and_lower_secondary'],
    },
    {
      id: 'fc:org:spusers.feide.no:unit:NO856326501',
      parent: 'fc:org:spusers.feide.no',
      displayName: 'Lerk VGS',
      type: 'fc:org',
      public: false,
      membership: {
        basic: 'member',
        primarySchool: false,
      },
      orgType: ['primary_and_lower_secondary'],
    },
    {
      id: 'fc:gogroup:spusers.feide.no:b:NO856326501:1sta:2000-07-01:2100-06-30',
      displayName: 'Klasse 1STA',
      type: 'fc:gogroup',
      notBefore: '2000-06-30T22:00:00Z',
      notAfter: '2100-06-30T23:00:00Z',
      go_type: 'b',
      parent: 'fc:org:spusers.feide.no:unit:NO856326501',
      membership: {
        basic: 'member',
        affiliation: ['employee'],
        displayName: 'Ansatt',
      },
      go_type_displayName: 'basisgruppe',
    },
    {
      id: 'fc:gogroup:spusers.feide.no:a:NO856326501:1sta-lab1:2000-07-01:2100-06-30',
      displayName: 'Laboratoriegruppe 1',
      type: 'fc:gogroup',
      notBefore: '2000-06-30T22:00:00Z',
      notAfter: '2100-06-30T23:00:00Z',
      go_type: 'a',
      parent: 'fc:org:spusers.feide.no:unit:NO856326501',
      membership: {
        basic: 'member',
        affiliation: ['employee'],
        displayName: 'Ansatt',
      },
      go_type_displayName: 'other groups',
    },
    {
      id: 'fc:gogroup:spusers.feide.no:a:NO856326501:1sta-lab2:2000-07-01:2100-06-30',
      displayName: 'Laboratoriegruppe 2',
      type: 'fc:gogroup',
      notBefore: '2000-06-30T22:00:00Z',
      notAfter: '2100-06-30T23:00:00Z',
      go_type: 'a',
      parent: 'fc:org:spusers.feide.no:unit:NO856326501',
      membership: {
        basic: 'member',
        affiliation: ['employee'],
        displayName: 'Ansatt',
      },
      go_type_displayName: 'other groups',
    },
    {
      id: 'fc:gogroup:spusers.feide.no:u:NO856326501:1mat11-1map1:2000-07-01:2100-06-30',
      displayName: 'Matematikk 1P',
      type: 'fc:gogroup',
      notBefore: '2000-06-30T22:00:00Z',
      notAfter: '2100-06-30T23:00:00Z',
      go_type: 'u',
      parent: 'fc:org:spusers.feide.no:unit:NO856326501',
      membership: {
        basic: 'member',
        affiliation: ['employee'],
        displayName: 'Ansatt',
      },
      go_type_displayName: 'undervisningsgruppe',
      grep: {
        displayName: 'Mathematics 1P',
        code: 'MAT1011',
      },
    },
    {
      id: 'fc:gogroup:spusers.feide.no:u:NO856326501:1mat13-1mat1:2000-07-01:2100-06-30',
      displayName: 'Matematikk 1T',
      type: 'fc:gogroup',
      notBefore: '2000-06-30T22:00:00Z',
      notAfter: '2100-06-30T23:00:00Z',
      go_type: 'u',
      parent: 'fc:org:spusers.feide.no:unit:NO856326501',
      membership: {
        basic: 'member',
        affiliation: ['employee'],
        displayName: 'Ansatt',
      },
      go_type_displayName: 'undervisningsgruppe',
      grep: {
        displayName: 'Mathematics 1T',
        code: 'MAT1013',
      },
    },
  ],
  primarySchool: {
    id: 'fc:org:spusers.feide.no:unit:NO956326504',
    parent: 'fc:org:spusers.feide.no',
    displayName: 'Lind VGS',
    type: 'fc:org',
    public: false,
    membership: {
      basic: 'member',
      primarySchool: true,
    },
    orgType: ['primary_and_lower_secondary'],
  },
};

describe('parseUserObject', () => {
  it('Correctly parses Feide user', () => {
    const expected = {
      uid: ['david_laerervgs'],
      displayName: 'David LærerVGS Jonsen',
      mail: ['david_laerervgs@feide.no'],
      eduPersonAffiliation: ['member', 'employee', 'faculty'],
      grepCodes: [],
      organizations: [
        {
          id: 'fc:org:spusers.feide.no',
          displayName: 'Rogn fylkeskommune',
          type: 'fc:org',
          public: false,
          membership: {
            basic: 'admin',
            affiliation: ['member', 'employee', 'faculty'],
            primaryAffiliation: 'employee',
            displayName: 'Akademisk ansatt',
          },
          orgType: ['higher_education', 'upper_secondary_owner', 'primary_and_lower_secondary_owner'],
          norEduOrgNIN: 'NO956326503',
          eduOrgLegalName: 'Rogn fylkeskommune',
          mail: 'support@feide.no',
          children: {
            basic: [],
            teaching: [],
            other: [],
          },
        },
        {
          id: 'fc:org:spusers.feide.no:unit:NO956326504',
          parent: 'fc:org:spusers.feide.no',
          displayName: 'Lind VGS',
          type: 'fc:org',
          public: false,
          membership: {
            basic: 'member',
            primarySchool: true,
          },
          orgType: ['primary_and_lower_secondary'],
          children: {
            basic: [],
            teaching: [],
            other: [],
          },
        },
        {
          id: 'fc:org:spusers.feide.no:unit:NO856326501',
          parent: 'fc:org:spusers.feide.no',
          displayName: 'Lerk VGS',
          type: 'fc:org',
          public: false,
          membership: {
            basic: 'member',
            primarySchool: false,
          },
          orgType: ['primary_and_lower_secondary'],
          children: {
            basic: [
              {
                id: 'fc:gogroup:spusers.feide.no:b:NO856326501:1sta:2000-07-01:2100-06-30',
                displayName: 'Klasse 1STA',
                type: 'fc:gogroup',
                notBefore: '2000-06-30T22:00:00Z',
                notAfter: '2100-06-30T23:00:00Z',
                go_type: 'b',
                parent: 'fc:org:spusers.feide.no:unit:NO856326501',
                membership: {
                  basic: 'member',
                  affiliation: ['employee'],
                  displayName: 'Ansatt',
                },
                go_type_displayName: 'basisgruppe',
              },
            ],
            teaching: [
              {
                id: 'fc:gogroup:spusers.feide.no:u:NO856326501:1mat11-1map1:2000-07-01:2100-06-30',
                displayName: 'Matematikk 1P',
                type: 'fc:gogroup',
                notBefore: '2000-06-30T22:00:00Z',
                notAfter: '2100-06-30T23:00:00Z',
                go_type: 'u',
                parent: 'fc:org:spusers.feide.no:unit:NO856326501',
                membership: {
                  basic: 'member',
                  affiliation: ['employee'],
                  displayName: 'Ansatt',
                },
                go_type_displayName: 'undervisningsgruppe',
                grep: {
                  displayName: 'Mathematics 1P',
                  code: 'MAT1011',
                },
              },
              {
                id: 'fc:gogroup:spusers.feide.no:u:NO856326501:1mat13-1mat1:2000-07-01:2100-06-30',
                displayName: 'Matematikk 1T',
                type: 'fc:gogroup',
                notBefore: '2000-06-30T22:00:00Z',
                notAfter: '2100-06-30T23:00:00Z',
                go_type: 'u',
                parent: 'fc:org:spusers.feide.no:unit:NO856326501',
                membership: {
                  basic: 'member',
                  affiliation: ['employee'],
                  displayName: 'Ansatt',
                },
                go_type_displayName: 'undervisningsgruppe',
                grep: {
                  displayName: 'Mathematics 1T',
                  code: 'MAT1013',
                },
              },
            ],
            other: [
              {
                id: 'fc:gogroup:spusers.feide.no:a:NO856326501:1sta-lab1:2000-07-01:2100-06-30',
                displayName: 'Laboratoriegruppe 1',
                type: 'fc:gogroup',
                notBefore: '2000-06-30T22:00:00Z',
                notAfter: '2100-06-30T23:00:00Z',
                go_type: 'a',
                parent: 'fc:org:spusers.feide.no:unit:NO856326501',
                membership: {
                  basic: 'member',
                  affiliation: ['employee'],
                  displayName: 'Ansatt',
                },
                go_type_displayName: 'other groups',
              },
              {
                id: 'fc:gogroup:spusers.feide.no:a:NO856326501:1sta-lab2:2000-07-01:2100-06-30',
                displayName: 'Laboratoriegruppe 2',
                type: 'fc:gogroup',
                notBefore: '2000-06-30T22:00:00Z',
                notAfter: '2100-06-30T23:00:00Z',
                go_type: 'a',
                parent: 'fc:org:spusers.feide.no:unit:NO856326501',
                membership: {
                  basic: 'member',
                  affiliation: ['employee'],
                  displayName: 'Ansatt',
                },
                go_type_displayName: 'other groups',
              },
            ],
          },
        },
      ],
    };
    const actual = parseUserObject(feideUserLaerer);
    expect(actual).toEqual(expected);
  });
});
