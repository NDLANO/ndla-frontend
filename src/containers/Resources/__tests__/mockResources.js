/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const resources = [
  {
    topicId: "urn:topic:170363",
    id: "urn:resource:883281e0-c5ec-42d8-8365-ceb12265ce9b",
    name: "Teknikker for idéutvikling",
    resourceTypes: [],
    contentUri: "urn:learningpath:1",
  },
  {
    topicId: "urn:topic:170363",
    id: "urn:resource:116ce6b7-2abe-4977-9fa9-11641bfc9b2b",
    name: "Klar, ferdig, kreativ!",
    resourceTypes: [],
    contentUri: "urn:learningpath:2",
  },
  {
    topicId: "urn:topic:170363",
    id: "urn:resource:345297a3-4134-4622-b325-c8245edb11dd",
    name: "Hva er en idé?",
    resourceTypes: [],
    contentUri: "urn:article:1",
  },
  {
    topicId: "urn:topic:170363",
    id: "urn:resource:6fd9f440-d91d-4bb0-89d4-757e564f77b9",
    name: "Ideer og idéutvikling",
    resourceTypes: [],
    contentUri: "urn:article:2",
  },
  {
    topicId: "urn:topic:170363",
    id: "urn:resource:0079aa08-8ed9-484a-bbd6-71d9297d8cab",
    name: "Kreativ kommunikasjon",
    resourceTypes: [],
    contentUri: "urn:article:3",
  },
];

export const additionalResources = [
  {
    topicId: "urn:topic:1:170165",
    id: "urn:resource:1:124553",
    name: "Spørreundersøkelser",
    contentUri: "urn:article:11",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }],
    path: "/subject:3/topic:1:179373/topic:1:170165/resource:1:124553",
    connectionId: "urn:topic-resource:cef4a496-4698-43b9-a998-d0a918d08573",
    additional: true,
  },
  {
    topicId: "urn:topic:1:170165",
    id: "urn:resource:1:125331",
    name: "Jeg vil delta - hvor er debatten?",
    contentUri: "urn:article:12",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }],
    path: "/subject:3/topic:1:179373/topic:1:170165/resource:1:125331",
    connectionId: "urn:topic-resource:b4942e5d-5ac2-4255-96ab-21f4d7ec31fd",
    additional: true,
  },
  {
    topicId: "urn:topic:1:170165",
    id: "urn:resource:1:17360",
    name: "Kjenner vi våre rettigheter?",
    contentUri: "urn:article:13",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }],
    path: "/subject:3/topic:1:179373/topic:1:170165/resource:1:17360",
    connectionId: "urn:topic-resource:e2cb96c1-afe2-426d-bf65-9b178f8f87fa",
    additional: true,
  },
];

export const resourceData1 = [
  {
    id: "urn:resource:1",
    name: "Teknikker for idéutvikling",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }],
    contentUri: "urn:learningpath:1",
  },
  {
    id: "urn:resource:2",
    name: "Hva er en idé?",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }, { id: "urn:resourcetype:learningPath" }],
    contentUri: "urn:article:1",
  },
  {
    id: "urn:resource:3",
    name: "Ideer og idéutvikling",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }, { id: "urn:resourcetype:academicArticle" }],
    contentUri: "urn:article:2",
  },
];

export const resourceData2 = [
  {
    id: "urn:resource:4",
    name: "Hva er menneskerettigheter?",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }],
    contentUri: "urn:article:3",
  },
  {
    id: "urn:resource:5",
    name: "Påstander konflikter",
    resourceTypes: [{ id: "urn:resourcetype:tasksAndActivities" }],
    contentUri: "urn:article:4",
  },
  {
    id: "urn:resource:6",
    name: "Endring av NATOs strategi",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial" }, { id: "urn:resourcetype:academicArticle" }],
    contentUri: "urn:article:2",
  },
];

export const resourceTypes = [
  {
    id: "urn:resourcetype:SourceMaterial",
    name: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:subjectMaterial",
    name: "Fagstoff",
    subtypes: [
      { id: "urn:resourcetype:academicArticle", name: "Fagartikkel" },
      { id: "urn:resourcetype:movieAndClip", name: "Film og filmklipp" },
      { id: "urn:resourcetype:simulation", name: "Simulering" },
    ],
  },
  {
    id: "urn:resourcetype:tasksAndActivities",
    name: "Oppgaver og aktiviteter",
    subtypes: [
      { id: "urn:resourcetype:exercise", name: "Øvelse" },
      { id: "urn:resourcetype:task", name: "Oppgave" },
      { id: "urn:resourcetype:workAssignment", name: "Arbeidsoppdrag" },
    ],
  },
  {
    id: "urn:resourcetype:reviewResource",
    name: "Vurderingsressurs",
  },
  { id: "urn:resourcetype:learningPath", name: "Læringssti" },
  { id: "urn:resourcetype:concept", name: "Forklaring" },
];
