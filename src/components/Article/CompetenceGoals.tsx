/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, {ComponentType} from 'react';
import { useQuery } from '@apollo/client';
import { injectT, tType } from '@ndla/i18n';
// @ts-ignore
import { CompetenceGoalTab } from '@ndla/ui';
import { isValidElementType } from 'react-is';
import Spinner from '@ndla/ui/lib/Spinner';

import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import {
  GQLArticle,
  GQLCompetenceGoal,
  GQLCoreElement,
  GQLSubject,
} from '../../graphqlTypes';

interface Props {
  article: GQLArticle;
  subject: GQLSubject;
  language: string;
  wrapperComponent: ComponentType;
  wrapperComponentProps: any;
}

interface LocalGQLCompetenceGoal extends Omit<GQLCompetenceGoal, 'title'> {
  name: string;
}

interface LocalGQLCoreElement
  extends Omit<GQLCoreElement, 'title' | 'description'> {
  name: string;
  text?: string;
}

interface CompetenceGoalsProps {
  competenceGoals: LocalGQLCompetenceGoal[];
  coreElements: LocalGQLCoreElement[];
}

interface CompetenceGoalType {
  id: string;
  type: string;
  title: string;
  groupedCompetenceGoals: {
    title: string;
    elements: {
      id: string;
      title: string;
      goals: {
        text: string;
        url: string;
      }[];
    }[];
  }[];
}

interface CoreElementType {
  id: string;
  type: string;
  title: string;
  groupedCoreElementItems: {
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
  }[];
}

const getUniqueCurriculums2 = (
  coreElements: LocalGQLCoreElement[],
): LocalGQLCoreElement['curriculum'][] => {
  const curriculums = coreElements
    .filter(e => e.curriculum?.id)
    .map(coreElement => coreElement.curriculum);
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

const getUniqueCurriculums = (
  competenceGoals: LocalGQLCompetenceGoal[],
): LocalGQLCompetenceGoal['curriculum'][] => {
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
) => {
  return competenceGoals
    .filter(
      competenceGoal =>
        competenceGoal.competenceGoalSet?.id === competenceGoalSetId,
    )
    .map(competenceGoal => ({
      text: competenceGoal.name,
      url: addUrl ? searchUrl + competenceGoal.id : 'a',
    }));
};

const sortElementsById = (
  elements: CompetenceGoalType['groupedCompetenceGoals'],
): CompetenceGoalType['groupedCompetenceGoals'] =>
  elements.map(e => ({
    ...e,
    elements: e.elements.sort((a: any, b: any) => {
      if (a.id! < b.id!) return -1;
      if (a.id! > b.id!) return 1;
      return 0;
    }),
  }));

const groupCompetenceGoals = (
  competenceGoals: LocalGQLCompetenceGoal[],
  addUrl: boolean = false,
): CompetenceGoalType['groupedCompetenceGoals'] => {
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
          ),
        }),
      ),
    }),
  );
  return sortElementsById(curriculumElements);
};

const groupCoreElements = (
  coreElements: LocalGQLCoreElement[],
): CoreElementType['groupedCoreElementItems'] => {

  const curriculumElements = getUniqueCurriculums2(coreElements).map(curriculum => ({
    title: `${curriculum?.title} (${curriculum!.id})`,
    elements: coreElements
      .filter(e => e.curriculum?.id === curriculum!.id)
      .map(coreElement => ({
        id: coreElement!.id,
        name: coreElement!.name,
        text: coreElement!.text,
        goals: {
          id: "",
          name: ""
        }
    }))
  }))
  // @ts-ignore
  return curriculumElements;
};

const CompetenceGoals = ({
  article,
  subject,
  language,
  wrapperComponent: Component,
  wrapperComponentProps,
  t,
}: Props & tType) => {
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
  );
  const LK20Goals = groupCompetenceGoals(
    competenceGoals.filter(goal => goal.type === 'LK20'),
    true,
  );
  const LK20Elements = groupCoreElements(coreElements || []);

  const competenceGoalsList = [
    ...(LK20Goals?.length
      ? [
          {
            id: '1',
            title: t('competenceGoals.competenceTabLK20label'),
            type: 'competenceGoals',
            groupedCompetenceGoals: LK20Goals,
          },
        ]
      : []),
    ...(LK20Elements?.length
      ? [
          {
            id: '2',
            title: t('competenceGoals.competenceTabCorelabel'),
            type: 'coreElement',
            groupedCoreElementItems: LK20Elements,
          },
        ]
      : []),
    ...(LK06Goals?.length
      ? [
          {
            id: '3',
            title: t('competenceGoals.competenceTabLK06label'),
            type: 'competenceGoals',
            groupedCompetenceGoals: LK06Goals,
          },
        ]
      : []),
  ];

  return (
    <Component {...wrapperComponentProps}>
      <CompetenceGoalTab title={subject?.name} list={competenceGoalsList} />
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

export default injectT(CompetenceGoals);
