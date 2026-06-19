/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getCompetenceGoals } from "../CompetenceGoals";

const competenceGoals = [
  {
    __typename: "CompetenceGoal" as const,
    id: "KM2648",
    title: "carry out basic first aid (KM2648)",
    type: "LK20",
    curriculum: {
      __typename: "Reference" as const,
      id: "HSF01-03",
      title: "Curriculum vg1 healthcare, child and youth development",
    },
    competenceGoalSet: {
      __typename: "Reference" as const,
      id: "KV244",
      title: "Competence aims and assessment health promotion",
    },
  },
  {
    __typename: "CompetenceGoal" as const,
    id: "KM2647",
    title:
      "discuss and give examples of what each person and society can do to improve their own health and public health (KM2647)",
    type: "LK20",
    curriculum: {
      __typename: "Reference" as const,
      id: "HSF01-03",
      title: "Curriculum vg1 healthcare, child and youth development",
    },
    competenceGoalSet: {
      __typename: "Reference" as const,
      id: "KV244",
      title: "Competence aims and assessment health promotion",
    },
  },
  {
    __typename: "CompetenceGoal" as const,
    id: "KM1232",
    title:
      "explain present-day changes in spoken Norwegian and reflect on relationships between language, culture and identity (KM1232)",
    type: "LK20",
    curriculum: {
      __typename: "Reference" as const,
      id: "NOR01-06",
      title: "Curriculum for Norwegian",
    },
    competenceGoalSet: {
      __typename: "Reference" as const,
      id: "KV115",
      title: "Competence aims and assessment Vg3 programmes for general studies",
    },
  },
];

test("That getCompetenceGoals groups competenceGoals by curriculum ", () => {
  const grouped = getCompetenceGoals(competenceGoals);
  expect(grouped).toMatchSnapshot();
});
