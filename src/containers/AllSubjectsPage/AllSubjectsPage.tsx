/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import sortBy from "lodash/sortBy";
import { parse, stringify } from "query-string";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import emotionStyled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { ErrorMessage, ContentPlaceholder, OneColumn, constants } from "@ndla/ui";
import FavoriteSubjects from "./FavoriteSubjects";
import LetterNavigation from "./LetterNavigation";
import SubjectCategory from "./SubjectCategory";
import { filterSubjects, groupSubjects } from "./utils";
import { AuthContext } from "../../components/AuthenticationContext";
import TabFilter from "../../components/TabFilter";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { useGraphQuery } from "../../util/runQueries";

const { ACTIVE_SUBJECTS, ARCHIVE_SUBJECTS, BETA_SUBJECTS, OTHER } = constants.subjectCategories;

const createFilterTranslation = (t: TFunction, key: string, addTail = true) => {
  const label = addTail
    ? `${t(`subjectCategories.${key}`)} ${t("common.subject", {
        count: 2,
      })}`
    : t(`subjectCategories.${key}`);
  return label;
};

const createFilters = (t: TFunction) => [
  {
    label: createFilterTranslation(t, ACTIVE_SUBJECTS),
    value: ACTIVE_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, ARCHIVE_SUBJECTS),
    value: ARCHIVE_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, BETA_SUBJECTS),
    value: BETA_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, OTHER, false),
    value: OTHER,
  },
  // TODO: Consider if all should be removed as a option with new filter logic
  {
    label: `${t("contentTypes.all")} ${t("common.subject", {
      count: 2,
    })}`,
    value: "all",
  },
];

const StyledMain = styled("main", { base: { paddingTop: "xxlarge" } });

const StyledColumn = emotionStyled(OneColumn)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.medium};
`;

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    padding: 0,
  },
});

export const allSubectsFragment = gql`
  fragment AllSubjects_Subject on Node {
    id
    name
    path
    url
    metadata {
      customFields
    }
  }
`;

const allSubjectsQuery = gql`
  query allSubjects {
    subjects: nodes(nodeType: SUBJECT, filterVisible: true) {
      ...AllSubjects_Subject
    }
  }
  ${allSubectsFragment}
`;

const convertToArray = (value: string | string[]): string[] => (Array.isArray(value) ? value : [value]);

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const subjectsQuery = useGraphQuery(allSubjectsQuery);

  const filterOptions = useMemo(() => createFilters(t), [t]);
  const [filter, _setFilter] = useState<string[]>(convertToArray(parse(location.search).filter) || [ACTIVE_SUBJECTS]);

  const setFilter = (value: string[]) => {
    const searchObject = parse(location.search);
    _setFilter(value);
    const search = stringify({
      ...searchObject,
      filter: value,
    });
    navigate(`${location.pathname}?${search}`);
  };

  const favoriteSubjects = user?.favoriteSubjects;
  const sortedSubjects = useMemo(
    () => sortBy(subjectsQuery.data?.subjects, (s) => s.name),
    [subjectsQuery.data?.subjects],
  );
  const groupedSubjects = useMemo(() => {
    const filteredSubjects = filterSubjects(sortedSubjects, filter);
    return groupSubjects(filteredSubjects);
  }, [sortedSubjects, filter]);

  const letters = useMemo(() => groupedSubjects.map((group) => group.label), [groupedSubjects]);

  if (subjectsQuery.loading) return <ContentPlaceholder />;
  if (subjectsQuery.error)
    return (
      <ErrorMessage
        illustration={{
          url: "/static/oops.gif",
          altText: t("errorMessage.title"),
        }}
        messages={{
          title: t("errorMessage.title"),
          description: t("subjectsPage.errorDescription"),
          goToFrontPage: t("errorMessage.goToFrontPage"),
        }}
      />
    );

  return (
    <StyledMain>
      <HelmetWithTracker title={t("htmlTitles.subjectsPage")} />
      <StyledColumn wide>
        <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
          {t("subjectsPage.allSubjects")}
        </Heading>
        {!!favoriteSubjects?.length && <FavoriteSubjects favorites={favoriteSubjects} subjects={sortedSubjects} />}
        <TabFilter value={filter} onChange={setFilter} options={filterOptions} />
        <LetterNavigation activeLetters={letters} />
        <StyledList aria-label={t("subjectsPage.alphabeticSort")}>
          {groupedSubjects.map(({ label, subjects }) => (
            <SubjectCategory favorites={favoriteSubjects} key={label} label={label} subjects={subjects} />
          ))}
        </StyledList>
      </StyledColumn>
    </StyledMain>
  );
};

export default AllSubjectsPage;
