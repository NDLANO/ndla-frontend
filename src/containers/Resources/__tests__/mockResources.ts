/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLResource } from "../../../graphqlTypes";

type ResourceData = Pick<GQLResource, "id" | "resourceTypes" | "name" | "contentUri">;

export const resourceData1: ResourceData[] = [
  {
    id: "urn:resource:1",
    name: "Teknikker for idéutvikling",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial", name: "Fagstoff" }],
    contentUri: "urn:learningpath:1",
  },
  {
    id: "urn:resource:2",
    name: "Hva er en idé?",
    resourceTypes: [
      { id: "urn:resourcetype:subjectMaterial", name: "Fagstoff" },
      { id: "urn:resourcetype:learningPath", name: "Læringssti" },
    ],
    contentUri: "urn:article:1",
  },
  {
    id: "urn:resource:3",
    name: "Ideer og idéutvikling",
    resourceTypes: [
      { id: "urn:resourcetype:subjectMaterial", name: "Fagstoff" },
      { id: "urn:resourcetype:academicArticle", name: "Læringssti" },
    ],
    contentUri: "urn:article:2",
  },
];

export const resourceData2: ResourceData[] = [
  {
    id: "urn:resource:4",
    name: "Hva er menneskerettigheter?",
    resourceTypes: [{ id: "urn:resourcetype:subjectMaterial", name: "Fagstoff" }],
    contentUri: "urn:article:3",
  },
  {
    id: "urn:resource:5",
    name: "Påstander konflikter",
    resourceTypes: [{ id: "urn:resourcetype:tasksAndActivities", name: "Oppgaver og aktiviteter" }],
    contentUri: "urn:article:4",
  },
  {
    id: "urn:resource:6",
    name: "Endring av NATOs strategi",
    resourceTypes: [
      { id: "urn:resourcetype:subjectMaterial", name: "Fagstoff" },
      { id: "urn:resourcetype:academicArticle", name: "Oppgaver og aktiviteter" },
    ],
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
  {
    id: "urn:resourcetype:concept",
    name: "Forklaring",
    subtypes: [{ id: "urn:resourcetype:conceptArticle", name: "Forklaringsartikkel" }],
  },
];
