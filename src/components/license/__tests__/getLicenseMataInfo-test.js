/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLicenseMetaInfo } from '../getLicenseMetaInfo';

const t = string => {
  const arr = string.split('.');
  return arr[arr.length - 1];
};
test('simple creators array', () => {
  const copyright = {
    creators: [
      {
        type: 'Originator',
        name: 'Siri Knudsen',
      },
    ],
    processors: [],
    rightsholders: [],
  };

  expect(getLicenseMetaInfo(copyright, t)).toMatchSnapshot();
});

test('creators writer and artist', () => {
  const copyright = {
    creators: [
      {
        type: 'Writer',
        name: 'Ernst Hemingway',
      },
      {
        type: 'Artist',
        name: 'Salvador Dalí',
      },
    ],
    processors: [],
    rightsholders: [],
  };

  expect(getLicenseMetaInfo(copyright, t)).toMatchSnapshot();
});
test('creators processors and rightsholders', () => {
  const copyright = {
    creators: [
      {
        type: 'Director',
        name: 'Francis Ford Coppola',
      },
    ],
    processors: [
      {
        type: 'Processor',
        name: 'Francis Ford Coppola',
      },
      {
        type: 'Linguistic',
        name: 'Mario Puzo',
      },
    ],
    rightsholders: [
      {
        type: 'Rightsholder',
        name: 'Paramount Pictures',
      },
      {
        type: 'Distributor',
        name: 'Alfran Productions',
      },
    ],
  };

  expect(getLicenseMetaInfo(copyright, t)).toMatchSnapshot();
});
