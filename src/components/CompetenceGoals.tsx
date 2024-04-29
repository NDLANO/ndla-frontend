/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, mq } from "@ndla/core";
import { FooterHeaderIcon } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Tabs } from "@ndla/tabs";
import CompetenceGoalTab, { CompetenceGoalType, CoreElementType } from "./CompetenceGoalTab";
import { GQLCompetenceGoal, GQLCompetenceGoalsQuery, GQLCoreElement } from "../graphqlTypes";
import { CompetenceGoalsType } from "../interfaces";
import { competenceGoalsQuery } from "../queries";
import handleError from "../util/handleError";
import { useGraphQuery } from "../util/runQueries";

interface Props {
  supportedLanguages?: string[];
  subjectId?: string;
  codes?: string[];
  isOembed?: boolean;
}

interface ElementType {
  id: string;
  title: string;
  type: "competenceGoals" | "coreElement";
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

const getUniqueCurriculums = (
  competenceGoals: (GQLCompetenceGoal | GQLCoreElement)[],
): (GQLCompetenceGoal["curriculum"] | GQLCoreElement["curriculum"])[] => {
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
  competenceGoals: GQLCompetenceGoal[],
  curriculumId: string,
): GQLCompetenceGoal["competenceGoalSet"][] => {
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
  competenceGoals: GQLCompetenceGoal[],
  competenceGoalSetId: string,
  addUrl: boolean,
  searchUrl: string,
  goalType: CompetenceGoalsType,
) => {
  return competenceGoals
    .filter((competenceGoal) => competenceGoal.competenceGoalSet?.id === competenceGoalSetId)
    .map((competenceGoal) => ({
      text: competenceGoal.title,
      url: addUrl ? searchUrl + competenceGoal.id : "",
      type: goalType,
      id: competenceGoal.id,
    }));
};

const sortElementsById = (elements: ElementType["groupedCompetenceGoals"]): ElementType["groupedCompetenceGoals"] =>
  elements!.map((e) => ({
    ...e,
    elements: e.elements?.sort((a: any, b: any) => {
      if (a.id! < b.id!) return -1;
      if (a.id! > b.id!) return 1;
      return 0;
    }),
  }));

export const groupCompetenceGoals = (
  competenceGoals: GQLCompetenceGoal[],
  addUrl: boolean = false,
  goalType: CompetenceGoalsType,
  subjectId?: string,
): ElementType["groupedCompetenceGoals"] => {
  const searchUrl = subjectId ? `/search?subjects=${subjectId}&grepCodes=` : "/search?grepCodes=";
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

export const groupCoreElements = (
  coreElements: GQLCoreElement[],
  subjectId?: string,
): ElementType["groupedCoreElementItems"] => {
  const searchUrl = subjectId ? `/search?subjects=${subjectId}&grepCodes=` : "/search?grepCodes=";
  return getUniqueCurriculums(coreElements).map((curriculum) => ({
    title: `${curriculum?.title} (${curriculum!.id})`,
    elements: coreElements
      .filter((e) => e.curriculum?.id === curriculum!.id)
      .map((coreElement) => ({
        id: coreElement!.id,
        title: coreElement!.title,
        text: coreElement.description!,
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
    skip: typeof window === "undefined",
  });

  useEffect(() => setCompetenceGoalsLoading(loading), [loading, setCompetenceGoalsLoading]);

  const tabs = useMemo(() => {
    const tabs = [];
    const lk20Goals = groupCompetenceGoals(data?.competenceGoals ?? [], true, "LK20", subjectId);
    const lk20Elements = groupCoreElements(data?.coreElements || [], subjectId);

    if (lk20Goals?.length) {
      tabs.push({
        id: "competenceGoals",
        title: t("competenceGoals.competenceTabLK20label"),
        content: <CompetenceGoalTab items={lk20Goals} type="goal" isOembed={isOembed} />,
      });
    }
    if (lk20Elements?.length) {
      tabs.push({
        id: "coreElement",
        title: t("competenceGoals.competenceTabCorelabel"),
        content: <CompetenceGoalTab items={lk20Elements} type="element" isOembed={isOembed} />,
      });
    }

    return tabs;
  }, [data?.competenceGoals, data?.coreElements, isOembed, subjectId, t]);

  if (error) {
    handleError(error);
    return null;
  }

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
            <CompetenceBadgeText>{t("competenceGoals.showCompetenceGoals")}</CompetenceBadgeText>
          </ButtonV2>
        </ModalTrigger>
        <ModalContent size="full">
          <ModalHeader>
            <ModalTitle>
              <FooterHeaderIcon size="normal" style={{ marginRight: "20px" }} />
              {t("competenceGoals.modalText")}
            </ModalTitle>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <CompetenceGoalsWrapper>
              <Tabs tabs={tabs} />
            </CompetenceGoalsWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompetenceGoals;
