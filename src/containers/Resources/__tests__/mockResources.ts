/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const resourceTypes = [
  { id: "urn:resourcetype:learningPath", name: "Læringssti" },
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
  {
    id: "urn:resourcetype:SourceMaterial",
    name: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:concept",
    name: "Forklaring",
    subtypes: [{ id: "urn:resourcetype:conceptArticle", name: "Forklaringsartikkel" }],
  },
];

export const resources = [
  {
    id: "urn:resource:1",
    title: "Resource 1",
    rank: 1,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:SourceMaterial", name: "Kildemateriale" }],
  },
  {
    id: "urn:resource:2",
    title: "Resource 2",
    rank: 2,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:reviewResource", name: "Vurderingsressurs" }],
  },
  {
    id: "urn:resource:3",
    title: "Resource 3",
    rank: 3,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:learningPath", name: "Læringssti" }],
  },
  {
    id: "urn:resource:4",
    title: "Resource 4",
    rank: 4,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:concept", name: "Forklaring" }],
  },
  {
    id: "urn:resource:5",
    title: "Resource 5",
    rank: 5,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:tasksAndActivities", name: "Oppgaver og aktiviteter" }],
  },
  {
    id: "urn:resource:6",
    title: "Resource 6",
    rank: 6,
    relevance: "urn:relevance:core",
    resourceTypes: [{ id: "urn:resourcetype:game", name: "Spill" }],
  },
];
