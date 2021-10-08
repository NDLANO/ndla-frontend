/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { ComponentType } from 'react';
import { useQuery } from '@apollo/client';
import { CompetenceGoalTab } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { isValidElementType } from 'react-is';
import Spinner from '@ndla/ui/lib/Spinner';

import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import {
  GQLArticle,
  GQLCompetenceGoal,
  GQLCoreElement,
} from '../../graphqlTypes';
import { CompetenceGoalsType } from '../../interfaces';

interface Props {
  article: GQLArticle;
  language: string;
  wrapperComponent: ComponentType;
  wrapperComponentProps: any;
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

interface CompetenceGoalsProps {
  competenceGoals: LocalGQLCompetenceGoal[];
  coreElements: LocalGQLCoreElement[];
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
      url: addUrl ? searchUrl + competenceGoal.id : 'a',
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
): ElementType['groupedCompetenceGoals'] => {
  const searchUrl = '/search?grepCodes=';
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
  article,
  language,
  wrapperComponent: Component,
  wrapperComponentProps,
}: Props) => {
  const { t } = useTranslation();
  const codes = article.grepCodes;
  const nodeId = article.oldNdlaUrl?.split('/').pop();
  const lang =
    article.supportedLanguages?.find(l => l === language) ||
    article.supportedLanguages?.[0];
  const { error, data, loading } = useQuery(competenceGoalsQuery, {
    variables: { codes, nodeId, language: lang },
  });

  if (error) {
    handleError(error);
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  const { competenceGoals, coreElements }: CompetenceGoalsProps = data;
  const LK06Goals = groupCompetenceGoals(
    competenceGoals.filter(goal => goal.type === 'LK06'),
    true,
    'LK06',
  );
  const LK20Goals = groupCompetenceGoals(
    competenceGoals.filter(goal => goal.type === 'LK20'),
    true,
    'LK20',
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
      <CompetenceGoalTab list={competenceGoalsList} />
    </Component>
  );
};

CompetenceGoals.propTypes = {
  wrapperComponent: (props: any, propName: string) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(
        `Invalid prop 'component' supplied to 'CompetenceGoals': the prop is not a valid React component`,
      );
    }
    return null;
  },
};

export default CompetenceGoals;
