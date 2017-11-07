/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const resources = [
  {
    topicId: 'urn:topic:170363',
    id: 'urn:resource:883281e0-c5ec-42d8-8365-ceb12265ce9b',
    name: 'Teknikker for idéutvikling',
    resourceTypes: [],
    contentUri: 'urn:learningpath:1',
  },
  {
    topicId: 'urn:topic:170363',
    id: 'urn:resource:116ce6b7-2abe-4977-9fa9-11641bfc9b2b',
    name: 'Klar, ferdig, kreativ!',
    resourceTypes: [],
    contentUri: 'urn:learningpath:2',
  },
  {
    topicId: 'urn:topic:170363',
    id: 'urn:resource:345297a3-4134-4622-b325-c8245edb11dd',
    name: 'Hva er en idé?',
    resourceTypes: [],
    contentUri: 'urn:article:1',
  },
  {
    topicId: 'urn:topic:170363',
    id: 'urn:resource:6fd9f440-d91d-4bb0-89d4-757e564f77b9',
    name: 'Ideer og idéutvikling',
    resourceTypes: [],
    contentUri: 'urn:article:2',
  },
  {
    topicId: 'urn:topic:170363',
    id: 'urn:resource:0079aa08-8ed9-484a-bbd6-71d9297d8cab',
    name: 'Kreativ kommunikasjon',
    resourceTypes: [],
    contentUri: 'urn:article:3',
  },
];

export const resourceData = [
  {
    name: 'Teknikker for idéutvikling',
    resourceTypes: [{ id: 'urn:resourcetype:subjectMaterial' }],
    contentUri: 'urn:learningpath:1',
  },
  {
    name: 'Hva er en idé?',
    resourceTypes: [
      { id: 'urn:resourcetype:subjectMaterial' },
      { id: 'urn:resourcetype:learningPath' },
    ],
    contentUri: 'urn:article:1',
  },
  {
    name: 'Ideer og idéutvikling',
    resourceTypes: [
      { id: 'urn:resourcetype:subjectMaterial' },
      { id: 'urn:resourcetype:academicArticle' },
    ],
    contentUri: 'urn:article:2',
  },
];

export const resourceTypes = [
  {
    id: 'urn:resourcetype:SourceMaterial',
    name: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:externalResource',
    name: 'Ekstern læringsressurs',
  },
  {
    id: 'urn:resourcetype:subjectMaterial',
    name: 'Fagstoff',
    subtypes: [
      { id: 'urn:resourcetype:academicArticle', name: 'Fagartikkel' },
      { id: 'urn:resourcetype:movieAndClip', name: 'Film og filmklipp' },
      { id: 'urn:resourcetype:simulation', name: 'Simulering' },
    ],
  },
  {
    id: 'urn:resourcetype:tasksAndActivities',
    name: 'Oppgaver og aktiviteter',
    subtypes: [
      { id: 'urn:resourcetype:exercise', name: 'Øvelse' },
      { id: 'urn:resourcetype:task', name: 'Oppgave' },
      { id: 'urn:resourcetype:workAssignment', name: 'Arbeidsoppdrag' },
    ],
  },
  {
    id: 'urn:resourcetype:reviewResource',
    name: 'Vurderingsressurs',
  },
  { id: 'urn:resourcetype:learningPath', name: 'Læringssti' },
  { id: 'urn:resourcetype:concept', name: 'Begrep' },
];
