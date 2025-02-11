/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { CloseLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { GQLSubjectFilterQuery } from "../../graphqlTypes";
import { getSubjectsCategories } from "../../util/subjects";
import { useStableSearchParams } from "../../util/useStableSearchParams";
import SubjectFilterContent from "../SearchPage/components/SubjectFilter";

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
  const [searchParams, setSearchParams] = useStableSearchParams();

  const subjectsQuery = useQuery<GQLSubjectFilterQuery>(subjectFilterQuery);

  const activeSubjectIds = useMemo(() => searchParams.get("subjects")?.split(",") ?? [], [searchParams]);

  const activeSubjects = useMemo(() => {
    return subjectsQuery.data?.nodes?.filter((s) => activeSubjectIds.includes(s.id)) ?? [];
  }, [activeSubjectIds, subjectsQuery.data?.nodes]);

  const onToggleSubject = useCallback(
    (id: string) => {
      if (activeSubjectIds.includes(id)) {
        setSearchParams({ subjects: activeSubjectIds.filter((s) => s !== id).join(",") });
      } else {
        setSearchParams({ subjects: activeSubjectIds.concat(id).join(",") });
      }
    },
    [activeSubjectIds, setSearchParams],
  );

  const localeSubjectCategories = useMemo(
    () => getSubjectsCategories(t, subjectsQuery.data?.nodes ?? []),
    [t, subjectsQuery.data],
  );

  return (
    <FilterContainer>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h3>{t("searchPage.subjectFilter.heading")}</h3>
      </Heading>
      <FiltersWrapper>
        {activeSubjects.map((subject) => (
          <Button key={subject.id} size="small" variant="primary" onClick={() => onToggleSubject(subject.id)}>
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
            <SubjectFilterContent
              categories={localeSubjectCategories}
              onToggleSubject={onToggleSubject}
              selectedSubjects={searchParams.get("subjects")?.split(",") ?? []}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </FilterContainer>
  );
};
