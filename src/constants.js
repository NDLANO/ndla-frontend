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
} from 'ndla-ui';

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

export const OLD_CATEGORIES_WITH_SUBJECTS = {
  fellesfag: [
    { nodeId: '42', lang: 'en', name: 'Engelsk' },
    { nodeId: '52253', name: 'Historie Vg2 og Vg3' },
    { nodeId: '46', name: 'Kroppsøving' },
    { nodeId: '55', name: 'Matematikk Vg1P' },
    { nodeId: '54', name: 'Matematikk Vg1T' },
    { nodeId: '53', name: 'Matematikk Vg2P' },
    { nodeId: '7', name: 'Naturfag' },
    { nodeId: '27', name: 'Norsk Vg2 og Vg3 SF' },
    { nodeId: '116784', name: 'Norsk YF og SF' },
    { nodeId: '36', name: 'Samfunnsfag' },
    { nodeId: '126960', beta: true, name: 'Sørsamisk som førstespråk' },
  ],
  yrkesfag: [
    { nodeId: '51', name: 'Barne- og ungdomsarbeiderfag Vg2' },
    { nodeId: '137414', name: 'Brønnteknikk' },
    { nodeId: '127013', name: 'Bygg- og anleggsteknikk Vg1' },
    { nodeId: '44', name: 'Design og håndverk Vg1' },
    { nodeId: '43', name: 'Elektrofag Vg1' },
    { nodeId: '8', name: 'Helse- og oppvekstfag Vg1' },
    { nodeId: '52', name: 'Helsearbeiderfag Vg2' },
    { nodeId: '102783', name: 'IKT-servicefag Vg2' },
    { nodeId: '86643', name: 'Kokk- og servitørfag Vg2' },
    { nodeId: '137415', name: 'Naturbruk Vg1' },
    { nodeId: '102780', name: 'Reiseliv Vg2' },
    { nodeId: '37', name: 'Restaurant- og matfag Vg1' },
    { nodeId: '2600', name: 'Romteknologi Vg3' },
    { nodeId: '102781', name: 'Salg, service og sikkerhet Vg2' },
    { nodeId: '52291', name: 'Service og samferdsel Vg1' },
    { nodeId: '35', name: 'Teknikk og industriell produksjon Vg1' },
    { nodeId: '102782', name: 'Transport og logistikk Vg2' },
  ],
  studiespesialiserende: [
    { nodeId: '52234', name: 'Biologi 1' },
    {
      nodeId: '71085',
      lang: 'en',
      name: 'Engelskspråklig litteratur og kultur',
    },
    { nodeId: '56850', lang: 'en', name: 'Internasjonal engelsk' },
    { nodeId: '127756', name: 'Kinesisk 1' },
    { nodeId: '138654', name: 'Kinesisk 2' },
    { nodeId: '6118', name: 'Kommunikasjon og kultur 1' },
    { nodeId: '2602', name: 'Kommunikasjon og kultur 2' },
    { nodeId: '2603', name: 'Kommunikasjon og kultur 3' },
    { nodeId: '52293', name: 'Markedsføring og ledelse 1' },
    { nodeId: '57933', name: 'Matematikk R1' },
    { nodeId: '98361', name: 'Matematikk R2' },
    { nodeId: '57934', name: 'Matematikk S1' },
    { nodeId: '98366', name: 'Matematikk S2' },
    { nodeId: '52222', name: 'Medie- og informasjonskunnskap 1 og 2' },
    {
      nodeId: '156500',
      beta: true,
      name: 'Medieuttrykk og mediesamfunnet',
    },
    { nodeId: '71082', lang: 'en', name: 'Samfunnsfaglig engelsk' },
    { nodeId: '137416', name: 'Tysk 1' },
    { nodeId: '138655', name: 'Tysk 2' },
  ],
};
