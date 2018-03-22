/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getAllTopicsBySubjectId,
  getTopic,
  getSubtopicsWithIntroduction,
  getSubjectMenu,
  getSubtopics,
  getTopicsFiltered,
  getTopicPath,
} from '../topic';

import { topics } from './mockTopics';
import {
  resourceData1,
  additionalResources,
  resourceData2,
  resourceTypes,
} from '../../Resources/__tests__/mockResources';

test('topicSelectors getAllTopicsBySubjectId', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
        'urn:subject:2': [],
      },
    },
  };

  expect(getAllTopicsBySubjectId('urn:subject:1')(state)).toBe(topics);
  expect(getAllTopicsBySubjectId('urn:subject:2')(state)).toEqual([]);
});

test('topicSelectors getTopic', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };

  expect(getTopic('urn:subject:1', topics[0].id)(state)).toBe(topics[0]);
  expect(getTopic('urn:subject:1', topics[4].id)(state)).toBe(topics[4]);
  expect(getTopic('urn:subject:1', 'sadfjl')(state)).toBe(undefined);
});

test('topicSelectors getSubtopics', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };
  const subtopics = getSubtopics('urn:subject:1', topics[0].id)(state);

  expect(subtopics.length).toBe(2);
  expect(subtopics[0]).toBe(topics[1]);
  expect(subtopics[1]).toBe(topics[2]);
});

test('topicSelectors getSubtopicsWithIntroduction', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
      topicIntroductions: {
        'urn:topic:1_1': {
          introduction: 'Tester',
        },
      },
    },
  };

  expect(
    getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[0],
  ).toEqual({
    id: 'urn:topic:1_1',
    introduction: 'Tester',
    name: 'Mediedesign',
    parent: topics[0].id,
  });
  expect(
    getSubtopicsWithIntroduction('urn:subject:1', topics[0].id)(state)[1],
  ).toEqual({
    contentUri: 'urn:article:1_2',
    id: 'urn:topic:1_2',
    introduction: undefined,
    name: 'Idéutvikling',
    parent: topics[0].id,
  });
});

test('topicSelectors getSubjectMenu', () => {
  const state = {
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
    filters: {
      active: {},
      all: {},
    },
    resources: {
      all: {
        'urn:topic:1': resourceData1,
        'urn:topic:2': additionalResources,
        'urn:topic:1_2': resourceData2,
      },
      types: resourceTypes,
    },
  };

  expect(getSubjectMenu('urn:subject:1')(state)).toMatchSnapshot();
});

test('topicSelectors getTopicPath', () => {
  const state = {
    locale: 'nb',
    topics: {
      all: {
        'urn:subject:1': topics,
      },
    },
  };
  const topicPath1 = getTopicPath('urn:subject:1', 'urn:topic:1_2_1')(state);
  expect(topicPath1.length).toBe(3);
  expect(topicPath1[0].name).toBe('Idéutvikling og mediedesign');
  expect(topicPath1[1].name).toBe('Idéutvikling');
  expect(topicPath1[2].name).toBe('Mediebransjen');

  const topicPath2 = getTopicPath('urn:subject:1', 'urn:topic:3')(state);
  expect(topicPath2).toEqual([]);

  const topicPath3 = getTopicPath('urn:subject:1', 'urn:topic:1_1')(state);
  expect(topicPath3.length).toBe(2);
  expect(topicPath1[0].name).toBe('Idéutvikling og mediedesign');
  expect(topicPath1[1].name).toBe('Idéutvikling');
});

test('get filtered topics with two of three filters active', () => {
  const state = {
    filters: {
      active: {
        'urn:subject:1': ['urn:filter:1', 'urn:filter:3'],
      },
      all: {
        'urn:subject:1': ['urn:filter:1', 'urn:filter:2', 'urn:filter:3'],
      },
    },
  };

  const topicsWithFilter1 = [{ id: 'urn:topic:1', filter: ['urn:filter:2'] }];
  expect(getTopicsFiltered('urn:subject:1', topicsWithFilter1)(state)).toEqual(
    [],
  );

  const topicsWithFilter2 = [
    { id: 'urn:topic:1', filter: ['urn:filter:2'] },
    { id: 'urn:topic:2', filter: ['urn:filter:1'] },
    { id: 'urn:topic:3', filter: ['urn:filter:3'] },
  ];
  expect(
    getTopicsFiltered('urn:subject:1', topicsWithFilter2)(state),
  ).toMatchSnapshot();

  const topicsWithFilter3 = [
    { id: 'urn:topic:1', filter: ['urn:filter:2'] },
    { id: 'urn:topic:2', filter: ['urn:filter:2', 'urn:filter:1'] },
    { id: 'urn:topic:3', filter: ['urn:filter:3'] },
  ];
  expect(
    getTopicsFiltered('urn:subject:1', topicsWithFilter3)(state),
  ).toMatchSnapshot();
});

test('get filtered topics when all filters are active', () => {
  const state = {
    filters: {
      active: {
        'urn:subject:1': ['urn:filter:1', 'urn:filter:2', 'urn:filter:3'],
      },
    },
  };

  const topicsWithFilter = [
    { id: 'urn:topic:1', filter: ['urn:filter:2'] },
    { id: 'urn:topic:2', filter: ['urn:filter:1'] },
    { id: 'urn:topic:3', filter: ['urn:filter:3'] },
  ];
  expect(
    getTopicsFiltered('urn:subject:1', topicsWithFilter)(state),
  ).toMatchSnapshot();
});

test('get filtered topics when none filters are active', () => {
  const state = {
    filters: {
      active: {
        'urn:subject:1': [],
      },
    },
  };

  const topicsWithFilter = [
    { id: 'urn:topic:1', filter: ['urn:filter:2'] },
    { id: 'urn:topic:2', filter: ['urn:filter:1'] },
    { id: 'urn:topic:3', filter: ['urn:filter:3'] },
  ];
  expect(
    getTopicsFiltered('urn:subject:1', topicsWithFilter)(state),
  ).toMatchSnapshot();
});
