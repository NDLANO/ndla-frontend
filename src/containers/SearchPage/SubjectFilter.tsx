/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { CheckLine, CloseLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldsetLegend,
  FieldsetRoot,
  Heading,
  MessageBox,
  Spinner,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { constants } from "@ndla/ui";
import { groupBy, sortBy } from "@ndla/util";
import { FilterContainer } from "./FilterContainer";
import { RESOURCE_NODE_TYPE, SUBJECT_NODE_TYPE, TOPIC_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import { GQLSubjectFilterQuery } from "../../graphqlTypes";
import { useLtiContext } from "../../LtiContext";

const FiltersWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

const subjectFilterQuery = gql`
  query subjectFilter {
    nodes(nodeType: "SUBJECT", filterVisible: true) {
      id
      name
      url
      metadata {
        customFields
      }
    }
  }
`;

type LocalSubject = NonNullable<GQLSubjectFilterQuery["nodes"]>[number];

interface SubjectCategory {
  type: string;
  subjects: LocalSubject[];
  message?: string;
}

type SubjectCategoryType = "active" | "archived" | "beta" | "other";

export const SubjectFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const nodeType = searchParams.get("type");
  const isLti = useLtiContext();
  const validNodeTypes: (string | null)[] = useMemo(
    () => (isLti ? [null] : [RESOURCE_NODE_TYPE, TOPIC_NODE_TYPE]),
    [isLti],
  );

  const subjectsQuery = useQuery<GQLSubjectFilterQuery>(subjectFilterQuery, {
    skip: nodeType === SUBJECT_NODE_TYPE,
  });

  useEffect(() => {
    if (!validNodeTypes.includes(nodeType) && searchParams.get("subjects")) {
      setSearchParams({ subjects: null });
    }
  }, [isLti, nodeType, searchParams, setSearchParams, validNodeTypes]);

  const activeSubjectIds = useMemo(() => searchParams.get("subjects")?.split(",") ?? [], [searchParams]);

  const activeSubjects = useMemo(() => {
    return subjectsQuery.data?.nodes?.filter((s) => activeSubjectIds.includes(s.id.replace("urn:subject:", ""))) ?? [];
  }, [activeSubjectIds, subjectsQuery.data?.nodes]);

  const onToggleSubject = useCallback(
    (id: string) => {
      const stripped = id.replace("urn:subject:", "");
      if (activeSubjectIds.includes(stripped)) {
        setSearchParams({ subjects: activeSubjectIds.filter((s) => s !== stripped).join(",") });
      } else {
        setSearchParams({ subjects: activeSubjectIds.concat(stripped).join(",") });
      }
    },
    [activeSubjectIds, setSearchParams],
  );

  if (!validNodeTypes.includes(nodeType)) {
    return;
  }

  return (
    <FilterContainer>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h3>{t("searchPage.subjectFilter.heading")}</h3>
      </Heading>
      <FiltersWrapper>
        {!!subjectsQuery.loading && <Spinner />}
        {activeSubjects.map((subject) => (
          <Button
            key={subject.id}
            size="small"
            variant="primary"
            onClick={() => onToggleSubject(subject.id)}
            aria-label={t("searchPage.subjectFilter.removeFilter", { subject: subject.name })}
            title={t("searchPage.subjectFilter.removeFilter", { subject: subject.name })}
          >
            {subject.name}
            <CloseLine />
          </Button>
        ))}
      </FiltersWrapper>
      <DialogRoot size="full">
        <DialogTrigger asChild>
          <Button variant="secondary">{t("searchPage.subjectFilter.trigger")}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogBody>
            <DialogHeader>
              <DialogTitle>{t("searchPage.subjectFilter.dialogTitle")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <SubjectFilterDialogContent
              subjects={subjectsQuery.data?.nodes ?? []}
              onToggleSubject={onToggleSubject}
              selectedSubjects={
                searchParams
                  .get("subjects")
                  ?.split(",")
                  .map((id) => `urn:subject:${id}`) ?? []
              }
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </FilterContainer>
  );
};

interface SubjectFilterDialogContentProps {
  subjects: LocalSubject[];
  onToggleSubject: (id: string) => void;
  selectedSubjects: string[];
}

const SubjectFilterDialogContent = ({
  subjects,
  onToggleSubject,
  selectedSubjects,
}: SubjectFilterDialogContentProps) => {
  const { t } = useTranslation();

  const categories = useMemo(() => {
    const reduced = (subjects ?? []).reduce<Record<SubjectCategoryType, SubjectCategory>>(
      (acc, curr) => {
        const subject = { ...curr, url: curr.url ?? "" };
        const category = curr.metadata?.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY];
        if (category === constants.subjectCategories.ACTIVE_SUBJECTS) {
          acc.active.subjects.push(subject);
        } else if (category === constants.subjectCategories.ARCHIVE_SUBJECTS) {
          acc.archived.subjects.push(subject);
        } else if (category === constants.subjectCategories.BETA_SUBJECTS) {
          acc.beta.subjects.push(subject);
        } else if (category === constants.subjectCategories.OTHER) {
          acc.other.subjects.push(subject);
        }
        return acc;
      },
      {
        active: { type: constants.subjectCategories.ACTIVE_SUBJECTS, subjects: [] },
        archived: {
          type: constants.subjectCategories.ARCHIVE_SUBJECTS,
          subjects: [],
          message: t("messageBoxInfo.frontPageExpired"),
        },
        beta: { type: constants.subjectCategories.BETA_SUBJECTS, subjects: [] },
        other: { type: constants.subjectCategories.OTHER, subjects: [] },
      },
    );
    return [reduced.active, reduced.archived, reduced.beta, reduced.other];
  }, [subjects, t]);

  const tabs = useMemo(() => {
    const allSubjects: LocalSubject[] = [];
    const data = [];
    categories.forEach((category) => {
      allSubjects.push(...category.subjects);
      const sortedSubjects = sortBy(category.subjects, (s) => s.name);
      if (category.subjects.length) {
        data.push({
          title: t(`subjectCategories.${category.type}`),
          id: category.type,
          message: category.message,
          subjects: groupBy(
            sortedSubjects.filter((s) => s.name.length),
            (s) => s.name[0]!.toUpperCase(),
          ),
        });
      }
    });

    const allSubjectsSorted = sortBy(allSubjects, (s) => s.name);

    data.push({
      title: t("frontpageMenu.allsubjects"),
      id: "allsubjects",
      message: undefined,
      subjects: groupBy(
        allSubjectsSorted.filter((s) => s.name.length),
        (s) => s.name[0]!.toUpperCase(),
      ),
    });

    return data;
  }, [categories, t]);

  return (
    <TabsRoot
      defaultValue={tabs[0]?.id}
      orientation="horizontal"
      variant="line"
      translations={{ listLabel: t("tabs.subjectFilter") }}
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
          {!!tab.message && (
            <StyledMessageBox variant="warning">
              <Text>{tab.message}</Text>
            </StyledMessageBox>
          )}
          <OuterList>
            {Object.entries(tab.subjects).map(([letter, subjects]) => (
              <OuterListItem key={letter}>
                <FieldsetRoot>
                  <FieldsetLegend
                    textStyle="title.large"
                    color="text.strong"
                    aria-label={t("searchPage.subjectLetter", { letter })}
                  >
                    {letter}
                  </FieldsetLegend>
                  <StyledCheckboxGroup>
                    {subjects.map((subject) => (
                      <StyledCheckboxRoot
                        key={subject.name}
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={() => onToggleSubject(subject.id)}
                      >
                        <CheckboxControl>
                          <CheckboxIndicator asChild>
                            <CheckLine />
                          </CheckboxIndicator>
                        </CheckboxControl>
                        <CheckboxLabel>{subject.name}</CheckboxLabel>
                        <CheckboxHiddenInput />
                      </StyledCheckboxRoot>
                    ))}
                  </StyledCheckboxGroup>
                </FieldsetRoot>
              </OuterListItem>
            ))}
          </OuterList>
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

const OuterList = styled("ul", {
  base: {
    listStyle: "none",
    tablet: {
      columnCount: "2",
      gap: "medium",
    },
    tabletWide: {
      columnCount: "3",
    },
  },
});

const OuterListItem = styled("li", {
  base: {
    breakInside: "avoid",
  },
});

const StyledMessageBox = styled(MessageBox, {
  base: {
    marginBlockStart: "medium",
  },
});

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: {
    marginBlockEnd: "small",
  },
});

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    paddingBlock: "4xsmall",
  },
});
