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
        {
          lang: 'en',
          name: 'Engelsk',
          id: 'urn:subject:39',
          beta: true,
        },
        {
          id: 'urn:subject:9',
          name: 'Historie Vg2 og Vg3',
        },
        { name: 'Kroppsøving', id: 'urn:subject:26' },
        { name: 'Matematikk 1P', id: 'urn:subject:34', beta: true },
        {
          name: 'Matematikk 1P (2019-2020)',
          id: 'urn:subject:29',
          filters: ['urn:filter:3fa5baa7-d8d8-4b50-98a0-411bbcef13fa'],
        },
        {
          name: 'Matematikk 1P-Y',
          id: 'urn:subject:10d8cd69-962f-484d-8059-bbfa4239485f',
          beta: true,
        },
        {
          name: 'Matematikk 1P-Y (2019-2020)',
          id: 'urn:subject:30',
          filters: ['urn:filter:04ad8a02-856c-417c-8a58-d2f293bf788d'],
        },
        { name: 'Matematikk 1T', id: 'urn:subject:33', beta: true },
        {
          name: 'Matematikk 1T-Y',
          id: 'urn:subject:8f9d3c55-9e3a-4414-9322-7cc6c8e3aab6',
          beta: true,
        },
        {
          name: 'Matematikk 1T-Y (2019-2020)',
          id: 'urn:subject:30',
          filters: ['urn:filter:ffe90e5e-d2c0-4def-8af3-07d9356a44dc'],
        },
        {
          name: 'Matematikk 2P',
          id: 'urn:subject:29',
          filters: ['urn:filter:b0a79538-d211-4254-852a-5aa2c4b89db7'],
        },
        {
          name: 'Matematikk 2P-Y',
          id: 'urn:subject:30',
          filters: ['urn:filter:38bc9538-63fd-48f3-9085-c2142dafd64c'],
        },
        {
          name: 'Naturfag',
          id: 'urn:subject:3d9454e8-460e-42c7-8f28-71663fbbf6e6',
          beta: true,
        },
        {
          name: 'Naturfag for påbygg',
          id: 'urn:subject:21',
        },
        {
          name: 'Norsk Vg1 SF',
          id: 'urn:subject:80063181-61d8-4c52-9bbc-4313376175a2',
          beta: true,
        },
        {
          name: 'Norsk Vg2 og Vg3 SF',
          id: 'urn:subject:19',
          filters: [
            'urn:filter:cddc3895-a19b-4e30-bd27-2f91b4a02894',
            'urn:filter:8bbcfdcb-2edc-4fc0-b8a4-f342514b9f20',
          ],
        },
        {
          name: 'Norsk YF',
          id: 'urn:subject:19',
          filters: [
            'urn:filter:f4581340-52f1-435d-8f99-d5de4e123f70',
            'urn:filter:f3d2143b-66e3-428c-89ca-72c1abc659ea',
          ],
        },
        {
          name: 'Religion og etikk',
          id: 'urn:subject:44',
        },
        {
          name: 'Samfunnskunnskap',
          id: 'urn:subject:5e750140-7d01-4b52-88ec-1daa007eeab3',
          beta: true,
        },
        { name: 'Samfunnsfag Vg2 YF', id: 'urn:subject:3' },
        {
          name: 'Sørsamisk som førstespråk Vg1',
          id: 'urn:subject:1b46e3eb-d130-4a05-8bfc-7932c2a03c23',
          beta: true,
        },
        {
          name: 'Sørsamisk som førstespråk Vg2/Vg3',
          id: 'urn:subject:15',
        },
      ],
    },
    {
      name: 'yrkesfag',
      subjects: [
        {
          name: 'Barne- og ungdomsarbeiderfag Vg2',
          id: 'urn:subject:40',
        },
        { name: 'Brønnteknikk', id: 'urn:subject:6' },
        {
          name: 'Bygg- og anleggsteknikk Vg1',
          id: 'urn:subject:11',
          beta: true,
        },
        { name: 'Elektrofag Vg1', id: 'urn:subject:16', beta: true },
        {
          name: 'Helse- og oppvekstfag Vg1',
          id: 'urn:subject:24',
          beta: true,
        },
        { name: 'Helsearbeiderfag Vg2', id: 'urn:subject:4' },
        { name: 'IKT-servicefag Vg2', id: 'urn:subject:25' },
        {
          name: 'Kokk- og servitørfag Vg2',
          id: 'urn:subject:41',
        },
        { name: 'Naturbruk Vg1', id: 'urn:subject:13', beta: true },
        { name: 'Reiseliv Vg2', id: 'urn:subject:35' },
        {
          name: 'Restaurant- og matfag Vg1',
          id: 'urn:subject:37',
          beta: true,
        },
        {
          name: 'Salg, service og sikkerhet Vg2',
          id: 'urn:subject:22',
        },
        {
          name: 'Salg, service og reiseliv Vg1',
          id: 'urn:subject:12',
          beta: true,
        },
        {
          name: 'Teknikk og industriell produksjon Vg1',
          id: 'urn:subject:28',
          beta: true,
        },
        {
          name: 'Transport og logistikk Vg2',
          id: 'urn:subject:36',
        },
        {
          name: 'Frisør, blomster, interiør og eksponeringsdesign Vg1',
          id: 'urn:subject:d41a472f-5a93-4e46-b658-f1e681284901',
          beta: true,
        },
        {
          name: 'Håndverk, design og produktutvikling Vg1',
          id: 'urn:subject:7509b507-548d-48e1-bef3-a06758e4820c',
          beta: true,
        },
        {
          name: 'Informasjonsteknologi og medieproduksjon Vg1',
          id: 'urn:subject:f248e20c-3131-495e-a759-c71678430d5f',
          beta: true,
        },
      ],
    },
    {
      name: 'studiespesialiserende',
      subjects: [
        { name: 'Biologi 1', id: 'urn:subject:42' },
        {
          lang: 'en',
          name: 'Engelskspråklig litteratur og kultur',
          id: 'urn:subject:17',
        },
        {
          lang: 'en',
          name: 'Internasjonal engelsk',
          id: 'urn:subject:27',
        },
        {
          name: 'Kinesisk 1',
          id: 'urn:subject:2',
          filters: ['urn:filter:1d441d40-358a-47a8-8cd5-7a80382a9062'],
          beta: true,
        },
        {
          name: 'Kinesisk 2',
          id: 'urn:subject:2',
          filters: ['urn:filter:3170610c-6a5a-4da5-aeba-adb247aae48c'],
          beta: true,
        },
        {
          name: 'Kommunikasjon og kultur 1',
          id: 'urn:subject:18',
          filters: ['urn:filter:18569f4e-5901-472a-96a0-b06c09b201fb'],
        },
        {
          name: 'Kommunikasjon og kultur 2',
          id: 'urn:subject:18',
          filters: ['urn:filter:4a73afd7-f263-48fa-b6fb-49bd21e517ab'],
        },
        {
          name: 'Kommunikasjon og kultur 3',
          id: 'urn:subject:18',
          filters: ['urn:filter:b9e86c43-93b8-49e9-81af-09dbc7d79401'],
        },
        {
          name: 'Markedsføring og ledelse 1',
          id: 'urn:subject:7',
        },

        {
          name: 'Matematikk R1',
          id: 'urn:subject:32',
          filters: ['urn:filter:fbdf693f-58d7-448e-ad5b-5d5c8fb685f3'],
        },
        {
          name: 'Matematikk R2',
          id: 'urn:subject:32',
          filters: ['urn:filter:4200b774-5b7b-4900-bf1d-e0b298b9cb97'],
        },
        {
          name: 'Matematikk S1',
          id: 'urn:subject:31',
          filters: ['urn:filter:3ae2c40f-4661-4863-9987-4944ff534974'],
        },
        {
          name: 'Matematikk S2',
          id: 'urn:subject:31',
          filters: ['urn:filter:ebaf899b-4161-4281-80ab-2cb7eebecca4'],
        },
        {
          name: 'Medie- og informasjonskunnskap',
          id: 'urn:subject:14',
        },
        {
          name: 'Medieuttrykk og mediesamfunnet Vg1',
          id: 'urn:subject:b84357cc-93f8-4742-a06b-24596307e5d4',
          beta: true,
        },
        {
          name: 'Medieuttrykk og mediesamfunnet Vg2/Vg3',
          id: 'urn:subject:1',
        },
        {
          lang: 'en',
          name: 'Samfunnsfaglig engelsk',
          id: 'urn:subject:23',
        },
        {
          name: 'Sosiologi og sosialantropologi',
          id: 'urn:subject:43',
        },
        {
          name: 'Tysk 1',
          id: 'urn:subject:8',
          filters: ['urn:filter:1a05c6c7-121e-49e2-933c-580da74afe1a'],
          beta: true,
        },
        {
          name: 'Tysk 2',
          id: 'urn:subject:8',
          filters: ['urn:filter:ec288dfb-4768-4f82-8387-fe2d73fff1e1'],
          beta: true,
        },
        {
          name: 'Sørsamisk som andrespråk, saemien 4',
          id: 'urn:subject:3af98d1d-6aec-46c8-a5bc-c524cc48dcc3',
          beta: true,
        },
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
  'urn:subject:20',
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
  'urn:subject:41',
  'urn:subject:42',
  'urn:subject:43',
  'urn:subject:44',
];

export const NOT_FOUND_PAGE_PATH = '/404';
export const RESOURCE_PAGE_PATH =
  '/subjects/:subjectId/:topicPath*/:topicId/resource\\::resourceId/:stepId?';
export const PLAIN_ARTICLE_PAGE_PATH = '/article/:articleId';
export const SEARCH_PATH = '/search(.*)';
export const TOPIC_PATH = '/subjects/:subjectId/:topicPath(.*)?/:topicId';
export const SUBJECT_PAGE_PATH = '/subjects/:subjectId/:topicId?/:subTopicId?';
export const SUBJECTS = '/subjects';
export const FILM_PAGE_PATH = '/subjects/subject:20';
export const PLAIN_LEARNINGPATH_PAGE_PATH = '/learningpaths/:learningpathId';
export const PLAIN_LEARNINGPATHSTEP_PAGE_PATH =
  '/learningpaths/:learningpathId/steps/:stepId';

export const SKIP_TO_CONTENT_ID = 'SkipToContentId';
export const SUPPORTED_LANGUAGES = ['nb', 'nn', 'en'];
