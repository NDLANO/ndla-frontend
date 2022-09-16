/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { CompetenceGoalTab } from '@ndla/ui';
import { competenceGoalsQuery } from '../queries';
import handleError from '../util/handleError';
import {
  GQLCompetenceGoal,
  GQLCompetenceGoalsQuery,
  GQLCoreElement,
} from '../graphqlTypes';
import { CompetenceGoalsType } from '../interfaces';
import { useGraphQuery } from '../util/runQueries';

interface Props {
  supportedLanguages?: string[];
  subjectId?: string;
  codes?: string[];
  nodeId?: string;
  wrapperComponent: ComponentType;
  wrapperComponentProps: any;
  isOembed?: boolean;
}

// We swap 'title' for 'name' when we fetch CompetenceGoals from GraphQL
interface LocalGQLCompetenceGoal extends Omit<GQLCompetenceGoal, 'title'> {
  name: string;
}

// We do the same as above with 'name' and 'text'
interface LocalGQLCoreElement
  extends Omit<GQLCoreElement, 'title' | 'description'> {
  name: string;
  text?: string;
}

interface ElementType {
  id: string;
  title: string;
  type: 'competenceGoals' | 'coreElement';
  groupedCompetenceGoals?: CompetenceGoalType[];
  groupedCoreElementItems?: CoreElementType[];
}

interface CompetenceGoalType {
  title: string;
  elements: {
    id: string;
    title: string;
    goals: {
      text: string;
      url: string;
      type: CompetenceGoalsType;
    }[];
  }[];
}

interface CoreElementType {
  title: string;
  elements: {
    id: string;
    name: string;
    text: string;
    goals: {
      id: string;
      name: string;
    }[];
  }[];
}

const getUniqueCurriculums = (
  competenceGoals: (LocalGQLCompetenceGoal | LocalGQLCoreElement)[],
): (
  | LocalGQLCompetenceGoal['curriculum']
  | LocalGQLCoreElement['curriculum']
)[] => {
  const curriculums = competenceGoals
    .filter(e => e.curriculum?.id)
    .map(competenceGoal => competenceGoal.curriculum);
  return Object.values(
    curriculums.reduce(
      (acc, current) => ({
        ...acc,
        [current!.id]: current,
      }),
      {},
    ),
  );
};

const getUniqueCompetenceGoalSet = (
  competenceGoals: LocalGQLCompetenceGoal[],
  curriculumId: string,
): LocalGQLCompetenceGoal['competenceGoalSet'][] => {
  const competenceGoalSet = competenceGoals
    .filter(e => e.competenceGoalSet?.id)
    .filter(e => e.curriculum?.id === curriculumId)
    .map(competenceGoal => competenceGoal.competenceGoalSet);
  return Object.values(
    competenceGoalSet.reduce(
      (acc, current) => ({
        ...acc,
        [current!.id]: current,
      }),
      {},
    ),
  );
};

const getUniqueCompetenceGoals = (
  competenceGoals: LocalGQLCompetenceGoal[],
  competenceGoalSetId: string,
  addUrl: boolean,
  searchUrl: string,
  goalType: CompetenceGoalsType,
) => {
  return competenceGoals
    .filter(
      competenceGoal =>
        competenceGoal.competenceGoalSet?.id === competenceGoalSetId,
    )
    .map(competenceGoal => ({
      text: competenceGoal.name,
      url: addUrl ? searchUrl + competenceGoal.id : '',
      type: goalType,
    }));
};

const sortElementsById = (
  elements: ElementType['groupedCompetenceGoals'],
): ElementType['groupedCompetenceGoals'] =>
  elements!.map(e => ({
    ...e,
    elements: e.elements.sort((a: any, b: any) => {
      if (a.id! < b.id!) return -1;
      if (a.id! > b.id!) return 1;
      return 0;
    }),
  }));

export const groupCompetenceGoals = (
  competenceGoals: LocalGQLCompetenceGoal[],
  addUrl: boolean = false,
  goalType: CompetenceGoalsType,
  subjectId?: string,
): ElementType['groupedCompetenceGoals'] => {
  const searchUrl = subjectId
    ? `/search?subjects=${subjectId}&grepCodes=`
    : '/search?grepCodes=';
  const curriculumElements = getUniqueCurriculums(competenceGoals).map(
    curriculum => ({
      title: `${curriculum?.title} (${curriculum?.id})`,
      elements: getUniqueCompetenceGoalSet(competenceGoals, curriculum!.id).map(
        competenceGoalSet => ({
          id: competenceGoalSet!.id,
          title: `${competenceGoalSet?.title} (${competenceGoalSet!.id})`,
          goals: getUniqueCompetenceGoals(
            competenceGoals,
            competenceGoalSet!.id,
            addUrl,
            searchUrl,
            goalType,
          ),
        }),
      ),
    }),
  );
  return sortElementsById(curriculumElements);
};

const groupCoreElements = (
  coreElements: LocalGQLCoreElement[],
): ElementType['groupedCoreElementItems'] => {
  return getUniqueCurriculums(coreElements).map(curriculum => ({
    title: `${curriculum?.title} (${curriculum!.id})`,
    elements: coreElements
      .filter(e => e.curriculum?.id === curriculum!.id)
      .map(coreElement => ({
        id: coreElement!.id,
        name: coreElement!.name,
        text: coreElement.text!,
        goals: [], // Currently (13.09.21) CoreElements does not have any goals
      })),
  }));
};

const CompetenceGoals = ({
  codes,
  nodeId,
  subjectId,
  wrapperComponent: Component,
  wrapperComponentProps,
  supportedLanguages,
  isOembed,
}: Props) => {
  const { t, i18n } = useTranslation();
  const language =
    supportedLanguages?.find(l => l === i18n.language) ||
    supportedLanguages?.[0] ||
    i18n.language;

  const { error, data } = useGraphQuery<GQLCompetenceGoalsQuery>(
    competenceGoalsQuery,
    {
      variables: { codes, nodeId, language },
    },
  );

  if (error) {
    handleError(error);
    return null;
  }

  if (!data) return null;

  const { competenceGoals, coreElements } = data;
  const LK06Goals = groupCompetenceGoals(
    competenceGoals?.filter(goal => goal.type === 'LK06') ?? [],
    false,
    'LK06',
  );
  const LK20Goals = groupCompetenceGoals(
    competenceGoals?.filter(goal => goal.type === 'LK20') ?? [],
    true,
    'LK20',
    subjectId,
  );
  const LK20Elements = groupCoreElements(coreElements || []);

  const CompetenceGoalsLK20Template: ElementType = {
    id: '1',
    title: t('competenceGoals.competenceTabLK20label'),
    type: 'competenceGoals',
    groupedCompetenceGoals: LK20Goals,
  };

  const CoreElementsTemplate: ElementType = {
    id: '2',
    title: t('competenceGoals.competenceTabCorelabel'),
    type: 'coreElement',
    groupedCoreElementItems: LK20Elements,
  };

  const CompetenceGoalsLK06Template: ElementType = {
    id: '3',
    title: t('competenceGoals.competenceTabLK06label'),
    type: 'competenceGoals',
    groupedCompetenceGoals: LK06Goals,
  };

  const competenceGoalsList: ElementType[] = [
    ...(LK20Goals?.length ? [CompetenceGoalsLK20Template] : []),
    ...(LK20Elements?.length ? [CoreElementsTemplate] : []),
    ...(LK06Goals?.length ? [CompetenceGoalsLK06Template] : []),
  ];

  return (
    <Component {...wrapperComponentProps}>
      <CompetenceGoalTab list={competenceGoalsList} isOembed={isOembed} />
    </Component>
  );
};

export default CompetenceGoals;
