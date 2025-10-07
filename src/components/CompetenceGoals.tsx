/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  PageContent,
  Spinner,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import CompetenceGoalTab, { CompetenceGoalType, CoreElementType } from "./CompetenceGoalTab";
import { DialogCloseButton } from "./DialogCloseButton";
import { GQLCompetenceGoal, GQLCompetenceGoalsQuery, GQLCoreElement } from "../graphqlTypes";
import { CompetenceGoalsType } from "../interfaces";

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

const StyledDialogHeader = styled(DialogHeader, {
  base: {
    paddingInline: "0",
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    paddingInline: "0",
  },
});

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
  const searchUrl = subjectId
    ? `/search?type=resource&subjects=${subjectId.replace("urn:subject:", "")}&grepCodes=`
    : "/search?type=resource&grepCodes=";
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
  const searchUrl = subjectId
    ? `/search?type=resource&subjects=${subjectId.replace("urn:subject:", "")}&grepCodes=`
    : "/search?type=resource&grepCodes=";
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

const competenceGoalsQuery = gql`
  query competenceGoals($codes: [String!], $language: String) {
    competenceGoals(codes: $codes, language: $language) {
      id
      title
      type
      curriculum {
        id
        title
      }
      competenceGoalSet {
        id
        title
      }
    }
    coreElements(codes: $codes, language: $language) {
      id
      title
      description
      curriculum {
        id
        title
      }
    }
  }
`;

const CompetenceGoals = ({ codes, subjectId, supportedLanguages, isOembed }: Props) => {
  const [competenceGoalsLoading, setCompetenceGoalsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const language = supportedLanguages?.find((l) => l === i18n.language) || supportedLanguages?.[0] || i18n.language;

  const { error, data, loading } = useQuery<GQLCompetenceGoalsQuery>(competenceGoalsQuery, {
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
    return null;
  }

  return (
    <DialogRoot size="full">
      <DialogTrigger asChild>
        {/* We bypass the regular loading prop here to avoid a crash that occurs when translating the page with Google Translate. */}
        <Button
          aria-label={competenceGoalsLoading ? t("loading") : undefined}
          variant="secondary"
          aria-disabled={competenceGoalsLoading ? "true" : undefined}
          size="small"
        >
          {!!competenceGoalsLoading && <Spinner size="small" />}
          {t("competenceGoals.showCompetenceGoals")}
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <PageContent>
            <StyledDialogHeader>
              <DialogTitle>{t("competenceGoals.modalText")}</DialogTitle>
              <DialogCloseButton />
            </StyledDialogHeader>
            <StyledDialogBody>
              <TabsRoot
                defaultValue={tabs[0]?.id}
                orientation="horizontal"
                variant="line"
                translations={{ listLabel: t("tabs.competenceGoals") }}
              >
                <TabsList>
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id}>
                      {tab.title}
                    </TabsTrigger>
                  ))}
                  <TabsIndicator />
                </TabsList>
                {tabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id}>
                    {tab.content}
                  </TabsContent>
                ))}
              </TabsRoot>
            </StyledDialogBody>
          </PageContent>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default CompetenceGoals;
