/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useMemo, useSyncExternalStore } from "react";
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
  Heading,
  PageContent,
  Spinner,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { groupBy, sortBy, uniqBy } from "@ndla/util";
import { DialogCloseButton } from "./DialogCloseButton";
import { GQLCompetenceGoal, GQLCompetenceGoalsQuery, GQLCoreElement, GQLReference } from "../graphqlTypes";

interface Props {
  subjectId?: string;
  codes?: string[];
  isOembed?: boolean;
}

const getUniqueCurriculums = (competenceGoals: (GQLCompetenceGoal | GQLCoreElement)[]): GQLReference[] => {
  const curriculums = competenceGoals
    .filter((e) => e.curriculum?.id)
    .map<GQLReference>((competenceGoal) => competenceGoal.curriculum!);
  return uniqBy(curriculums, (item) => item?.id);
};

interface CompetenceGoalCurriculum extends GQLReference {
  competenceGoalSets: CompetenceGoalSet[];
}

interface CompetenceGoalSet extends GQLReference {
  goals: {
    id: string;
    title: string;
    type: string;
  }[];
}

interface CoreElementCurriculum extends GQLReference {
  coreElements: GQLCoreElement[];
}

export const getCompetenceGoals = (competenceGoals: GQLCompetenceGoal[]): CompetenceGoalCurriculum[] => {
  const curriculums = getUniqueCurriculums(competenceGoals);
  const goalsBySet = groupBy(
    competenceGoals.filter((cg) => cg.competenceGoalSet?.id),
    (goal) => goal.competenceGoalSet?.id ?? "",
  );
  const setsByCurriculum = groupBy(
    competenceGoals.filter((cg) => cg.curriculum?.id),
    (goal) => goal.curriculum?.id ?? "",
  );
  return curriculums.map((curriculum) => {
    const goalSets = uniqBy(setsByCurriculum[curriculum.id] ?? [], (set) => set.competenceGoalSet!.id);
    const sortedGoalSets = sortBy(goalSets, (set) => set.competenceGoalSet!.id);
    const goalSetsWithGoals = sortedGoalSets.map((goalSet) => ({
      ...goalSet.competenceGoalSet!,
      goals: uniqBy(goalsBySet[goalSet.competenceGoalSet?.id ?? "_"] ?? [], (goal) => goal.id),
    }));
    return { ...curriculum, competenceGoalSets: goalSetsWithGoals };
  });
};

const getCoreElements = (coreElements: GQLCoreElement[]): CoreElementCurriculum[] => {
  const curriculums = getUniqueCurriculums(coreElements);
  const groupedByCurriculum = groupBy(coreElements, (element) => element.curriculum?.id ?? "");
  return curriculums.map((curriculum) => ({ ...curriculum, coreElements: groupedByCurriculum[curriculum.id] ?? [] }));
};

const toSearchUrl = (code: string, subjectId: string | undefined) => {
  if (subjectId) {
    return `/search?type=resource&subjects=${subjectId.replace("urn:subject:", "")}&grepCodes=${code}`;
  }
  return `/search?type=resource&grepCodes=${code}`;
};

const competenceGoalsQuery = gql`
  query competenceGoals($codes: [String!]) {
    competenceGoals(codes: $codes) {
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
    coreElements(codes: $codes) {
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

export const CompetenceGoals = ({ codes, subjectId, isOembed }: Props) => {
  const { t } = useTranslation();

  const { error, data, loading } = useQuery<GQLCompetenceGoalsQuery>(competenceGoalsQuery, {
    variables: { codes },
    skip: typeof window === "undefined",
  });

  const competenceGoalsLoading = useSyncExternalStore(
    () => () => {},
    () => loading,
    () => true,
  );

  const tabs = useMemo(() => {
    const tabs = [];
    const competenceGoals = getCompetenceGoals(data?.competenceGoals ?? []);
    const coreElements = getCoreElements(data?.coreElements || []);

    if (competenceGoals?.length) {
      tabs.push({
        id: "competenceGoals" as const,
        title: t("competenceGoals.competenceTabLK20label"),
        items: competenceGoals,
      });
    }
    if (coreElements?.length) {
      tabs.push({
        id: "coreElement" as const,
        title: t("competenceGoals.competenceTabCorelabel"),
        items: coreElements,
      });
    }

    return tabs;
  }, [data, t]);

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
            <DialogHeader>
              <DialogTitle>{t("competenceGoals.modalText")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
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
                    {tab.id === "competenceGoals" ? (
                      <CompetenceGoalsContent items={tab.items} subjectId={subjectId} isOembed={isOembed} />
                    ) : (
                      <CoreElementsContent items={tab.items} subjectId={subjectId} isOembed={isOembed} />
                    )}
                  </TabsContent>
                ))}
              </TabsRoot>
              <div>
                {`${t("competenceGoals.licenseData")} `}
                <SafeLink to="https://data.norge.no/nlod/no" target="_blank">
                  NLOD
                </SafeLink>
                {`, ${t("competenceGoals.licenseFrom")} `}
                <SafeLink to="https://data.udir.no/" target="_blank">
                  data.udir.no
                </SafeLink>
              </div>
            </DialogBody>
          </PageContent>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

interface ContentProps<T extends GQLReference> {
  items: T[];
  isOembed: boolean | undefined;
  subjectId: string | undefined;
}

const CoreElementsContent = ({ items, isOembed, subjectId }: ContentProps<CoreElementCurriculum>) => {
  const { t } = useTranslation();

  return (
    <ItemsWrapper>
      {items.map((curriculum) => (
        <CompetenceItemWrapper key={curriculum.id}>
          <Heading textStyle="title.large" asChild consumeCss>
            <h2>{`${curriculum.title} (${curriculum.id})`}</h2>
          </Heading>
          <OuterList>
            {curriculum.coreElements.map((element) => (
              <OuterListItem key={element.id}>
                <Heading textStyle="label.large" fontWeight="bold" asChild consumeCss>
                  <h3>{element.title}</h3>
                </Heading>
                <CoreElementWrapper>
                  <Text asChild consumeCss>
                    <div>{parse(element.description ?? "")}</div>
                  </Text>
                  <SafeLink to={toSearchUrl(element.id, subjectId)} target={isOembed ? "_blank" : undefined}>
                    {t("competenceGoals.coreResourceSearchText", { code: element.id })}
                  </SafeLink>
                </CoreElementWrapper>
              </OuterListItem>
            ))}
          </OuterList>
        </CompetenceItemWrapper>
      ))}
    </ItemsWrapper>
  );
};

const CompetenceGoalsContent = ({ items, isOembed, subjectId }: ContentProps<CompetenceGoalCurriculum>) => {
  const { t } = useTranslation();

  return (
    <ItemsWrapper>
      {items.map((curriculum) => (
        <CompetenceItemWrapper key={curriculum.id}>
          <Heading textStyle="title.large" asChild consumeCss>
            <h2>{`${curriculum.title} (${curriculum.id})`}</h2>
          </Heading>
          <Text>{t("competenceGoals.competenceGoalTitle")}</Text>
          <OuterList>
            {curriculum.competenceGoalSets.map((goalSet) => (
              <OuterListItem key={goalSet.id}>
                <Heading textStyle="label.large" fontWeight="bold" asChild consumeCss>
                  <h3>{`${goalSet.title} (${goalSet.id})`}</h3>
                </Heading>
                <InnerList>
                  {goalSet.goals.map((goal) => (
                    <li key={goal.id}>
                      <Text>
                        {goal.title}{" "}
                        <SafeLink to={toSearchUrl(goal.id, subjectId)} target={isOembed ? "_blank" : undefined}>
                          {t("competenceGoals.competenceGoalResourceSearchText", { code: goal.id })}
                        </SafeLink>
                      </Text>
                    </li>
                  ))}
                </InnerList>
              </OuterListItem>
            ))}
          </OuterList>
        </CompetenceItemWrapper>
      ))}
    </ItemsWrapper>
  );
};

const ItemsWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
  },
});

const CompetenceItemWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    alignItems: "flex-start",
  },
});

const OuterList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const OuterListItem = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const InnerList = styled("ul", {
  base: {
    listStyle: "outside",
    paddingInlineStart: "large",
    "& li": {
      marginBlock: "xsmall",
    },
  },
});

const CoreElementWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});
