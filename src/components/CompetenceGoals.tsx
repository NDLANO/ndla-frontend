/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, mq } from '@ndla/core';
import { FooterHeaderIcon } from '@ndla/icons/common';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from '@ndla/modal';
import { CompetenceGoalTab } from '@ndla/ui';
import { GQLCompetenceGoal, GQLCompetenceGoalsQuery, GQLCoreElement } from '../graphqlTypes';
import { CompetenceGoalsType } from '../interfaces';
import { competenceGoalsQuery } from '../queries';
import handleError from '../util/handleError';
import { useGraphQuery } from '../util/runQueries';

interface Props {
  supportedLanguages?: string[];
  subjectId?: string;
  codes?: string[];
  isOembed?: boolean;
}

// We swap 'title' for 'name' when we fetch CompetenceGoals from GraphQL
interface LocalGQLCompetenceGoal extends Omit<GQLCompetenceGoal, 'title'> {
  name: string;
}

// We do the same as above with 'name' and 'text'
interface LocalGQLCoreElement extends Omit<GQLCoreElement, 'title' | 'description'> {
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

const CompetenceBadgeText = styled.span`
  padding: 0 5px;
`;

const CompetenceGoalsWrapper = styled.div`
  height: 100%;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 32px;
  ${mq.range({ from: breakpoints.mobile })} {
    padding: 0;
  }
`;

interface CompetenceGoalType {
  title: string;
  elements: {
    id: string;
    title: string;
    goals: {
      id: string;
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
    title: string;
    text: string;
    url: string;
  }[];
}

const getUniqueCurriculums = (
  competenceGoals: (LocalGQLCompetenceGoal | LocalGQLCoreElement)[],
): (LocalGQLCompetenceGoal['curriculum'] | LocalGQLCoreElement['curriculum'])[] => {
  const curriculums = competenceGoals
    .filter((e) => e.curriculum?.id)
    .map((competenceGoal) => competenceGoal.curriculum);
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
    .filter((e) => e.competenceGoalSet?.id)
    .filter((e) => e.curriculum?.id === curriculumId)
    .map((competenceGoal) => competenceGoal.competenceGoalSet);
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
    .filter((competenceGoal) => competenceGoal.competenceGoalSet?.id === competenceGoalSetId)
    .map((competenceGoal) => ({
      text: competenceGoal.name,
      url: addUrl ? searchUrl + competenceGoal.id : '',
      type: goalType,
      id: competenceGoal.id,
    }));
};

const sortElementsById = (elements: ElementType['groupedCompetenceGoals']): ElementType['groupedCompetenceGoals'] =>
  elements!.map((e) => ({
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
  const searchUrl = subjectId ? `/search?subjects=${subjectId}&grepCodes=` : '/search?grepCodes=';
  const curriculumElements = getUniqueCurriculums(competenceGoals).map((curriculum) => ({
    title: `${curriculum?.title} (${curriculum?.id})`,
    elements: getUniqueCompetenceGoalSet(competenceGoals, curriculum!.id).map((competenceGoalSet) => ({
      id: competenceGoalSet!.id,
      title: `${competenceGoalSet?.title} (${competenceGoalSet!.id})`,
      goals: getUniqueCompetenceGoals(competenceGoals, competenceGoalSet!.id, addUrl, searchUrl, goalType),
    })),
  }));
  return sortElementsById(curriculumElements);
};

const groupCoreElements = (
  coreElements: LocalGQLCoreElement[],
  subjectId?: string,
): ElementType['groupedCoreElementItems'] => {
  const searchUrl = subjectId ? `/search?subjects=${subjectId}&grepCodes=` : '/search?grepCodes=';
  return getUniqueCurriculums(coreElements).map((curriculum) => ({
    title: `${curriculum?.title} (${curriculum!.id})`,
    elements: coreElements
      .filter((e) => e.curriculum?.id === curriculum!.id)
      .map((coreElement) => ({
        id: coreElement!.id,
        title: coreElement!.name,
        text: coreElement.text!,
        url: `${searchUrl}${coreElement.id}`,
      })),
  }));
};

const CompetenceGoals = ({ codes, subjectId, supportedLanguages, isOembed }: Props) => {
  const [competenceGoalsLoading, setCompetenceGoalsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const language = supportedLanguages?.find((l) => l === i18n.language) || supportedLanguages?.[0] || i18n.language;

  const { error, data, loading } = useGraphQuery<GQLCompetenceGoalsQuery>(competenceGoalsQuery, {
    variables: { codes, language },
    skip: typeof window === 'undefined',
  });

  useEffect(() => setCompetenceGoalsLoading(loading), [loading, setCompetenceGoalsLoading]);

  if (error) {
    handleError(error);
    return null;
  }

  const LK20Goals = groupCompetenceGoals(data?.competenceGoals ?? [], true, 'LK20', subjectId);
  const LK20Elements = groupCoreElements(data?.coreElements || [], subjectId);

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

  const competenceGoalsList: ElementType[] = [
    ...(LK20Goals?.length ? [CompetenceGoalsLK20Template] : []),
    ...(LK20Elements?.length ? [CoreElementsTemplate] : []),
  ];

  return (
    <>
      <Modal>
        <ModalTrigger>
          <ButtonV2
            aria-busy={competenceGoalsLoading}
            size="xsmall"
            colorTheme="light"
            shape="pill"
            disabled={competenceGoalsLoading}
          >
            <FooterHeaderIcon />
            <CompetenceBadgeText>{t('competenceGoals.showCompetenceGoals')}</CompetenceBadgeText>
          </ButtonV2>
        </ModalTrigger>
        <ModalContent size="full">
          <ModalHeader>
            <ModalTitle>
              <FooterHeaderIcon size="normal" style={{ marginRight: '20px' }} />
              {t('competenceGoals.modalText')}
            </ModalTitle>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <CompetenceGoalsWrapper>
              <CompetenceGoalTab list={competenceGoalsList} isOembed={isOembed} />
            </CompetenceGoalsWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompetenceGoals;
