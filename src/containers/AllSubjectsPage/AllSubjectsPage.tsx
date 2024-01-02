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
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Select } from "@ndla/select";
import { HelmetWithTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { ErrorMessage, ContentPlaceholder, OneColumn, constants, getMastheadHeight } from "@ndla/ui";
import FavoriteSubjects from "./FavoriteSubjects";
import LetterNavigation from "./LetterNavigation";
import SubjectCategory from "./SubjectCategory";
import { filterSubjects, groupSubjects } from "./utils";
import { AuthContext } from "../../components/AuthenticationContext";
import TabFilter from "../../components/TabFilter";
import { MastheadHeightPx, SKIP_TO_CONTENT_ID } from "../../constants";
import { useUserAgent } from "../../UserAgentContext";
import { useSubjects } from "../MyNdla/subjectQueries";

const { ACTIVE_SUBJECTS, ARCHIVE_SUBJECTS, BETA_SUBJECTS, OTHER } = constants.subjectCategories;

const createFilterTranslation = (t: TFunction, key: string, addTail = true) => {
  const label = addTail
    ? `${t(`subjectCategories.${key}`)} ${t("common.subject", {
        count: 2,
      })}`
    : t(`subjectCategories.${key}`);
  return label.toLocaleUpperCase();
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
  {
    label: `${t("contentTypes.all")} ${t("common.subject", {
      count: 2,
    })}`.toUpperCase(),
    value: "all",
  },
];

const StyledColumn = styled(OneColumn)`
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SelectWrapper = styled.div`
  padding: ${spacing.xsmall};
  border-radius: 12px;
  background: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.lighter};
  margin: ${spacing.normal} 0 ${spacing.small};
`;

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectors = useUserAgent();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (window.location && window.location.hash) {
      setTimeout(() => {
        const element = document.getElementById(window.location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition = absoluteTop - (getMastheadHeight() || MastheadHeightPx) - 20;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 400);
    }
  }, []);

  const { error, loading, subjects } = useSubjects();

  const filterOptions = useMemo(() => createFilters(t), [t]);
  const [filter, _setFilter] = useState<string>(parse(location.search).filter || ACTIVE_SUBJECTS);
  const setFilter = (value: string) => {
    const searchObject = parse(location.search);
    _setFilter(value);
    const search = stringify({
      ...searchObject,
      filter: value !== ACTIVE_SUBJECTS ? value : undefined,
    });
    navigate(`${location.pathname}?${search}`);
  };

  const favoriteSubjects = user?.favoriteSubjects;
  const sortedSubjects = useMemo(() => sortBy(subjects, (s) => s.name), [subjects]);
  const groupedSubjects = useMemo(() => {
    const filteredSubjects = filterSubjects(sortedSubjects, filter);
    return groupSubjects(filteredSubjects);
  }, [sortedSubjects, filter]);

  const letters = useMemo(() => groupedSubjects.map((group) => group.label), [groupedSubjects]);

  if (loading) return <ContentPlaceholder />;
  if (error)
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
    <main className="c-resources u-padding-top-large">
      <HelmetWithTracker title={t("htmlTitles.subjectsPage")} />
      <StyledColumn wide>
        <Heading element="h1" headingStyle="h1" serif id={SKIP_TO_CONTENT_ID}>
          {t("subjectsPage.allSubjects")}
        </Heading>
        {!!favoriteSubjects?.length && <FavoriteSubjects favorites={favoriteSubjects} subjects={sortedSubjects} />}
        {selectors?.isMobile ? (
          <SelectWrapper>
            <Select<false>
              value={filterOptions.find((opt) => opt.value === filter)}
              onChange={(value) => value && setFilter(value?.value)}
              options={filterOptions}
              colorTheme="white"
              outline
              bold
              prefix={`${t("subjectsPage.shows").toUpperCase()}: `}
            />
          </SelectWrapper>
        ) : (
          <TabFilter value={filter} onChange={setFilter} options={filterOptions} />
        )}
        <LetterNavigation activeLetters={letters} />
      </StyledColumn>
      <StyledList aria-label={t("subjectsPage.alphabeticSort")}>
        {groupedSubjects.map(({ label, subjects }) => (
          <SubjectCategory favorites={favoriteSubjects} key={label} label={label} subjects={subjects} />
        ))}
      </StyledList>
    </main>
  );
};

export default AllSubjectsPage;
