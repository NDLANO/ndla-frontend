/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
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
import { FilterContainer } from "./FilterContainer";
import { RESOURCE_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchParams";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { GQLSubjectFilterQuery, GQLSubjectInfoFragment } from "../../graphqlTypes";
import { getSubjectsCategories } from "../../util/subjects";

const FiltersWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

const subjectFilterQuery = gql`
  # TODO: this should be based on the content in SubjectFilterContent
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

export const SubjectFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const nodeType = searchParams.get("type");

  const subjectsQuery = useQuery<GQLSubjectFilterQuery>(subjectFilterQuery, {
    skip: !!nodeType && nodeType !== RESOURCE_NODE_TYPE,
  });

  useEffect(() => {
    if (nodeType && nodeType !== RESOURCE_NODE_TYPE) {
      setSearchParams({ subjects: null });
    }
  }, [nodeType, setSearchParams]);

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

  const localeSubjectCategories = useMemo(
    () => getSubjectsCategories(t, subjectsQuery.data?.nodes ?? []),
    [t, subjectsQuery.data],
  );

  if (nodeType && nodeType !== RESOURCE_NODE_TYPE) {
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
              categories={localeSubjectCategories}
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

interface Category {
  type?: string;
  visible?: boolean;
  message?: string;
  subjects: GQLSubjectInfoFragment[];
}

interface SubjectFilterDialogContentProps {
  categories: Category[];
  onToggleSubject: (id: string) => void;
  selectedSubjects: string[];
}

const SubjectFilterDialogContent = ({
  categories,
  onToggleSubject,
  selectedSubjects,
}: SubjectFilterDialogContentProps) => {
  const { t } = useTranslation();

  const tabs = useMemo(() => {
    const allSubjects: GQLSubjectInfoFragment[] = [];
    const data = [];
    categories.forEach((category) => {
      allSubjects.push(...category.subjects);
      const sortedSubjects = sortBy(category.subjects, (s) => s.name);
      if (category.visible) {
        data.push({
          title: t(`subjectCategories.${category.type}`),
          id: category.type,
          content: (
            <>
              {!!category.message && (
                <StyledMessageBox variant="warning">
                  <Text>{category.message}</Text>
                </StyledMessageBox>
              )}
              <SubjectList
                subjects={groupBy(sortedSubjects, (s) => s.name[0]?.toUpperCase())}
                onToggleSubject={onToggleSubject}
                selectedSubjects={selectedSubjects}
              />
            </>
          ),
        });
      }
    });

    const allSubjectsSorted = sortBy(allSubjects, (s) => s.name);

    data.push({
      title: t("frontpageMenu.allsubjects"),
      id: "allsubjects",
      content: (
        <SubjectList
          subjects={groupBy(allSubjectsSorted, (s) => s.name[0]?.toUpperCase())}
          onToggleSubject={onToggleSubject}
          selectedSubjects={selectedSubjects}
        />
      ),
    });

    return data;
  }, [categories, onToggleSubject, selectedSubjects, t]);

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
          {tab.content}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

interface SubjectListProps {
  subjects: Record<string, GQLSubjectInfoFragment[]>;
  onToggleSubject: (id: string) => void;
  selectedSubjects: string[];
}

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

const SubjectList = ({ subjects, onToggleSubject, selectedSubjects = [] }: SubjectListProps) => {
  const { t } = useTranslation();

  return (
    <OuterList>
      {Object.entries(subjects).map(([letter, subjects]) => (
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
  );
};
