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

export const additionalResources = [
  {
    topicId: 'urn:topic:1:170165',
    id: 'urn:resource:1:124553',
    name: 'Spørreundersøkelser',
    contentUri: 'urn:article:11',
    path: '/subject:3/topic:1:179373/topic:1:170165/resource:1:124553',
    connectionId: 'urn:topic-resource:cef4a496-4698-43b9-a998-d0a918d08573',
    additional: true,
  },
  {
    topicId: 'urn:topic:1:170165',
    id: 'urn:resource:1:125331',
    name: 'Jeg vil delta - hvor er debatten?',
    contentUri: 'urn:article:12',
    path: '/subject:3/topic:1:179373/topic:1:170165/resource:1:125331',
    connectionId: 'urn:topic-resource:b4942e5d-5ac2-4255-96ab-21f4d7ec31fd',
    additional: true,
  },
  {
    topicId: 'urn:topic:1:170165',
    id: 'urn:resource:1:17360',
    name: 'Kjenner vi våre rettigheter?',
    contentUri: 'urn:article:13',
    path: '/subject:3/topic:1:179373/topic:1:170165/resource:1:17360',
    connectionId: 'urn:topic-resource:e2cb96c1-afe2-426d-bf65-9b178f8f87fa',
    additional: true,
  },
];

export const resourceData = [
  {
    name: 'Teknikker for idéutvikling',
    resourceTypes: [{ id: 'urn:resource-type:1' }],
    contentUri: 'urn:learningpath:1',
  },
  {
    name: 'Hva er en idé?',
    resourceTypes: [
      { id: 'urn:resource-type:1' },
      { id: 'urn:resource-type:2' },
    ],
    contentUri: 'urn:article:1',
  },
  {
    name: 'Ideer og idéutvikling',
    resourceTypes: [
      { id: 'urn:resource-type:1' },
      { id: 'urn:resource-type:3' },
    ],
    contentUri: 'urn:article:2',
  },
];

export const resourceTypes = [
  {
    id: 'urn:resource-type:1',
    name: 'Fagstoff',
    subtypes: [
      {
        id: 'urn:resource-type:3',
        name: 'Artikler',
      },
      {
        id: 'urn:resource-type:4',
        name: 'Video',
      },
    ],
  },
  {
    id: 'urn:resource-type:2',
    name: 'Læringssti',
  },
  {
    id: 'urn:resource-type:5',
    name: 'Vedlegg',
  },
  {
    id: 'urn:resource-type:6',
    name: 'Interaktivitet',
  },
  {
    id: 'urn:resource-type:7',
    name: 'Oppgave',
  },
  {
    id: 'urn:resource-type:8',
    name: 'Simulering',
  },
];
