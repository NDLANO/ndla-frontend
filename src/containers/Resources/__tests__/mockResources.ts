/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  {
    id: "urn:resourcetype:concept",
    name: "Forklaring",
    subtypes: [{ id: "urn:resourcetype:conceptArticle", name: "Forklaringsartikkel" }],
  },
];
