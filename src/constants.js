/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import {
  SubjectMaterialBadge,
  TasksAndActivitiesBadge,
  SubjectBadge,
  ExternalLearningResourcesBadge,
  SourceMaterialBadge,
  LearningPathBadge,
} from '@ndla/ui';

export const RESOURCE_TYPE_LEARNING_PATH = 'urn:resourcetype:learningPath';
export const RESOURCE_TYPE_SUBJECT_MATERIAL =
  'urn:resourcetype:subjectMaterial';
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES =
  'urn:resourcetype:reviewResource';
export const RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES =
  'urn:resourcetype:externalResource';
export const RESOURCE_TYPE_SOURCE_MATERIAL = 'urn:resourcetype:SourceMaterial';

export const RELEVANCE_CORE = 'urn:relevance:core';
export const RELEVANCE_SUPPLEMENTARY = 'urn:relevance:supplementary';

export const contentTypeIcons = {
  subject: <SubjectBadge size="x-small" background />,
  'topic-article': <SubjectBadge size="x-small" background />,
  'learning-path': <LearningPathBadge size="x-small" background />,
  'tasks-and-activities': <TasksAndActivitiesBadge size="x-small" background />,
  'external-learning-resources': (
    <ExternalLearningResourcesBadge size="x-small" backgrounde />
  ),
  'source-material': <SourceMaterialBadge size="x-small" background />,
  'subject-material': <SubjectMaterialBadge size="x-small" background />,
};

export const FRONTPAGE_CATEGORIES = {
  categories: [
    {
      name: 'fellesfag',
      subjects: [
        { nodeId: '42', lang: 'en', name: 'Engelsk', id: 'urn:subject:39' },
        {
          id: 'urn:subject:9',
          nodeId: '52253',
          name: 'Historie Vg2 og Vg3',
        },
        { nodeId: '46', name: 'Kroppsøving', id: 'urn:subject:26' },
        { nodeId: '55', name: 'Matematikk 1P', id: 'urn:subject:34' },
        { nodeId: '54', name: 'Matematikk 1T', id: 'urn:subject:33' },
        { nodeId: '53', name: 'Matematikk 2P', id: 'urn:subject:29' },
        { name: 'Matematikk 1P-Y', id: 'urn:subject:30' },
        { name: 'Matematikk 1T-Y', id: 'urn:subject:30' },
        { name: 'Matematikk 2P-Y', id: 'urn:subject:30' },
        { nodeId: '7', name: 'Naturfag', id: 'urn:subject:21' },
        {
          nodeId: '27',
          name: 'Norsk Vg2 og Vg3 SF',
          shortname: 'SF Vg2,SF Vg3',
          id: 'urn:subject:19',
        },
        {
          nodeId: '116784',
          name: 'Norsk YF og SF',
          shortname: 'SF Vg1,PB Vg3,YF Vg1/Vg2',
          id: 'urn:subject:19',
        },
        { nodeId: '185100', beta: true, name: 'Religion og etikk' },
        { nodeId: '36', name: 'Samfunnsfag', id: 'urn:subject:3' },
        {
          nodeId: '126960',
          beta: true,
          name: 'Sørsamisk som førstespråk',
          id: 'urn:subject:15',
        },
      ],
    },
    {
      name: 'yrkesfag',
      subjects: [
        {
          nodeId: '51',
          name: 'Barne- og ungdomsarbeiderfag Vg2',
          id: 'urn:subject:40',
        },
        { nodeId: '137414', name: 'Brønnteknikk', id: 'urn:subject:6' },
        {
          nodeId: '127013',
          name: 'Bygg- og anleggsteknikk Vg1',
          id: 'urn:subject:11',
        },
        { nodeId: '44', name: 'Design og håndverk Vg1', id: 'urn:subject:38' },
        { nodeId: '43', name: 'Elektrofag Vg1', id: 'urn:subject:16' },
        {
          nodeId: '8',
          name: 'Helse- og oppvekstfag Vg1',
          id: 'urn:subject:24',
        },
        { nodeId: '52', name: 'Helsearbeiderfag Vg2', id: 'urn:subject:4' },
        { nodeId: '102783', name: 'IKT-servicefag Vg2', id: 'urn:subject:25' },
        { nodeId: '86643', name: 'Kokk- og servitørfag Vg2' },
        { nodeId: '137415', name: 'Naturbruk Vg1', id: 'urn:subject:13' },
        { nodeId: '102780', name: 'Reiseliv Vg2', id: 'urn:subject:35' },
        {
          nodeId: '37',
          name: 'Restaurant- og matfag Vg1',
          id: 'urn:subject:37',
        },
        { nodeId: '2600', name: 'Romteknologi Vg3' },
        {
          nodeId: '102781',
          name: 'Salg, service og sikkerhet Vg2',
          id: 'urn:subject:22',
        },
        {
          nodeId: '52291',
          name: 'Service og samferdsel Vg1',
          id: 'urn:subject:12',
        },
        {
          nodeId: '35',
          name: 'Teknikk og industriell produksjon Vg1',
          id: 'urn:subject:28',
        },
        {
          nodeId: '102782',
          name: 'Transport og logistikk Vg2',
          id: 'urn:subject:36',
        },
      ],
    },
    {
      name: 'studiespesialiserende',
      subjects: [
        { nodeId: '52234', name: 'Biologi 1' },
        {
          id: 'urn:subject:17',
          nodeId: '71085',
          lang: 'en',
          name: 'Engelskspråklig litteratur og kultur',
        },
        {
          nodeId: '56850',
          lang: 'en',
          name: 'Internasjonal engelsk',
          id: 'urn:subject:27',
        },
        { nodeId: '127756', name: 'Kinesisk 1', id: 'urn:subject:2' },
        { nodeId: '138654', name: 'Kinesisk 2', id: 'urn:subject:2' },
        {
          nodeId: '6118',
          name: 'Kommunikasjon og kultur 1',
          shortname: 'KK1',
          id: 'urn:subject:18',
        },
        {
          nodeId: '2602',
          name: 'Kommunikasjon og kultur 2',
          shortname: 'KK2',
          id: 'urn:subject:18',
        },
        {
          nodeId: '2603',
          name: 'Kommunikasjon og kultur 3',
          shortname: 'KK3',
          id: 'urn:subject:18',
        },
        {
          nodeId: '52293',
          name: 'Markedsføring og ledelse 1',
          id: 'urn:subject:7',
        },

        { nodeId: '57933', name: 'Matematikk R1', id: 'urn:subject:32' },
        { nodeId: '98361', name: 'Matematikk R2', id: 'urn:subject:32' },
        { nodeId: '57934', name: 'Matematikk S1', id: 'urn:subject:31' },
        { nodeId: '98366', name: 'Matematikk S2', id: 'urn:subject:31' },
        {
          name: 'Medie- og informasjonskunnskap',
          id: 'urn:subject:14',
        },
        {
          nodeId: '156500',
          beta: true,
          name: 'Medieuttrykk og mediesamfunnet',
          id: 'urn:subject:1',
        },
        {
          nodeId: '71082',
          lang: 'en',
          name: 'Samfunnsfaglig engelsk',
          id: 'urn:subject:23',
        },
        {
          nodeId: '185103',
          beta: true,
          name: 'Sosiologi og sosialantropologi',
        },
        { nodeId: '137416', name: 'Tysk 1', id: 'urn:subject:8' },
        { nodeId: '138655', name: 'Tysk 2', id: 'urn:subject:8' },
      ],
    },
  ],
};

export const ALLOWED_SUBJECTS = [
  'urn:subject:1',
  'urn:subject:2',
  'urn:subject:3',
  'urn:subject:4',
  'urn:subject:6',
  'urn:subject:7',
  'urn:subject:8',
  'urn:subject:9',
  'urn:subject:11',
  'urn:subject:12',
  'urn:subject:13',
  'urn:subject:14',
  'urn:subject:15',
  'urn:subject:16',
  'urn:subject:17',
  'urn:subject:18',
  'urn:subject:19',
  'urn:subject:21',
  'urn:subject:22',
  'urn:subject:23',
  'urn:subject:24',
  'urn:subject:25',
  'urn:subject:26',
  'urn:subject:27',
  'urn:subject:28',
  'urn:subject:35',
  'urn:subject:37',
  'urn:subject:38',
  'urn:subject:39',
  'urn:subject:40',
  'urn:subject:29',
  'urn:subject:30',
  'urn:subject:31',
  'urn:subject:32',
  'urn:subject:33',
  'urn:subject:34',
  'urn:subject:36',
];

export const ARTICLE_PAGE_PATH =
  '/subjects/:subjectId/:topicPath*/:topicId/resource\\::resourceId';
export const PLAIN_ARTICLE_PAGE_PATH = '/article/:articleId';
export const SEARCH_PATH = '/search(.*)';
export const TOPIC_PATH = '/subjects/:subjectId/:topicPath(.*)?/:topicId';
export const SUBJECT_PAGE_PATH = '/subjects/:subjectId';
export const SUBJECTS = '/subjects';
export const COLLECT_EXPERIMENTS = 'http://localhost:4000';
