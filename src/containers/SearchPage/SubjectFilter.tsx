/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
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
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { subjectCategories } from "@ndla/ui";
import { sortBy } from "@ndla/util";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { TabFilter } from "../../components/TabFilter";
import { GQLSubjectFilterQuery } from "../../graphqlTypes";
import { useLtiContext } from "../../LtiContext";
import { createFilters, groupAndFilterSubjectsByCategory } from "../../util/subjectFilter";
import { FilterContainer } from "./FilterContainer";
import { ALL_NODE_TYPES, defaultNodeType, RESOURCE_NODE_TYPE, SUBJECT_NODE_TYPE, TOPIC_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchPageParams";

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

const SubFilterCheckboxGroup = styled(CheckboxGroup, {
  base: {
    flexDirection: "row",
  },
});

type LocalSubject = NonNullable<GQLSubjectFilterQuery["nodes"]>[number];

export const SubjectFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const isLti = useLtiContext();
  const nodeType = useMemo(() => searchParams.get("type") ?? defaultNodeType(isLti), [isLti, searchParams]);
  const validNodeTypes: (string | null)[] = useMemo(
    () => (isLti ? [null] : [RESOURCE_NODE_TYPE, TOPIC_NODE_TYPE, ALL_NODE_TYPES]),
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
          <DialogHeader>
            <DialogTitle>{t("searchPage.subjectFilter.dialogTitle")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
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
  const [_selectedFilter, _setSelectedFilter] = useState<string>(subjectCategories.ACTIVE_SUBJECTS);
  const [subFilters, setSubFilters] = useState<string[]>([]);
  const filters = createFilters(t);
  const selectedFilter = filters.find((f) => f.value === _selectedFilter) ?? filters[0]!;

  const sortedSubjects = useMemo(() => sortBy(subjects, (s) => s.name), [subjects]);
  const groupedSubjects = useMemo(
    () => groupAndFilterSubjectsByCategory(selectedFilter.value, subFilters, sortedSubjects),
    [selectedFilter.value, sortedSubjects, subFilters],
  );

  const setSelectedFilter = (value: string) => {
    _setSelectedFilter(value);
    setSubFilters([]);
  };

  return (
    <>
      <TabFilter value={selectedFilter.value} onChange={setSelectedFilter} options={filters} />
      {!!selectedFilter.subfilters.length && (
        <FieldsetRoot>
          <FieldsetLegend>{t("subjectsPage.subcategory")}</FieldsetLegend>
          <SubFilterCheckboxGroup value={subFilters} onValueChange={setSubFilters}>
            {selectedFilter.subfilters.map((option) => (
              <CheckboxRoot key={option.value} value={option.value} variant="chip">
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxLabel>{option.label}</CheckboxLabel>
                <CheckboxHiddenInput />
              </CheckboxRoot>
            ))}
          </SubFilterCheckboxGroup>
        </FieldsetRoot>
      )}
      <OuterList>
        {groupedSubjects.map((group) => (
          <OuterListItem key={group.label}>
            <FieldsetRoot>
              <FieldsetLegend
                textStyle="title.large"
                color="text.strong"
                aria-label={t("searchPage.subjectLetter", { letter: group.label })}
              >
                {group.label}
              </FieldsetLegend>
              <StyledCheckboxGroup>
                {group.subjects.map((subject) => (
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
    </>
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
