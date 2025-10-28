/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { subjectCategories } from "@ndla/ui";
import { groupBy, sortBy } from "@ndla/util";
import { FavoriteSubjects } from "./FavoriteSubjects";
import { LetterNavigation } from "./LetterNavigation";
import { SubjectCategory } from "./SubjectCategory";
import { useNavigateToHash } from "../../components/Article/articleHelpers";
import { AuthContext } from "../../components/AuthenticationContext";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { TabFilter } from "../../components/TabFilter";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLAllSubjectsQuery, GQLAllSubjectsQueryVariables } from "../../graphqlTypes";
import { useStableSearchParams } from "../../util/useStableSearchParams";

const createFilterTranslation = (t: TFunction, key: string, addTail = true) => {
  const label = addTail
    ? `${t(`subjectCategories.${key}`)} ${t("common.subject", {
        count: 2,
      }).toLowerCase()}`
    : t(`subjectCategories.${key}`);
  return label;
};

const createFilters = (t: TFunction) => [
  {
    label: createFilterTranslation(t, subjectCategories.ACTIVE_SUBJECTS),
    value: subjectCategories.ACTIVE_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, subjectCategories.ARCHIVE_SUBJECTS),
    value: subjectCategories.ARCHIVE_SUBJECTS,
  },

  {
    label: createFilterTranslation(t, subjectCategories.BETA_SUBJECTS),
    value: subjectCategories.BETA_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, subjectCategories.OTHER, false),
    value: subjectCategories.OTHER,
  },
  {
    label: t("subjectsPage.tabFilter.all"),
    value: "all",
  },
];

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xxlarge",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    padding: 0,
  },
});

const allSubjectsQuery = gql`
  query allSubjects {
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

const LETTER_REGEXP = /[A-Z\WÆØÅ]+/;

export const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchParams();
  const { user } = useContext(AuthContext);

  useNavigateToHash(undefined);

  const subjectsQuery = useQuery<GQLAllSubjectsQuery, GQLAllSubjectsQueryVariables>(allSubjectsQuery);

  const filterOptions = useMemo(() => createFilters(t), [t]);
  const selectedFilter = params.get("filter") ?? subjectCategories.ACTIVE_SUBJECTS;

  const setFilter = (value: string) => {
    setParams({ filter: value }, { replace: true });
  };

  const favoriteSubjects = user?.favoriteSubjects;
  const sortedSubjects = useMemo(() => sortBy(subjectsQuery.data?.nodes, (s) => s.name), [subjectsQuery.data?.nodes]);
  const groupedSubjects = useMemo(() => {
    const filteredSubjects = sortedSubjects.filter((sub) => {
      const fields = sub.metadata.customFields;
      return selectedFilter === "all" ? fields.subjectCategory : fields.subjectCategory === selectedFilter;
    });

    const grouped = groupBy(filteredSubjects, (sub) => {
      const firstChar = sub.name[0]?.toUpperCase();
      return firstChar?.match(LETTER_REGEXP) ? firstChar : "#";
    });

    return sortBy(
      Object.entries(grouped).map((g) => ({ label: g[0], subjects: g[1] })),
      (g) => g.label,
    );
  }, [sortedSubjects, selectedFilter]);

  const letters = useMemo(() => groupedSubjects.map((group) => group.label), [groupedSubjects]);

  if (subjectsQuery.loading) return <ContentPlaceholder />;
  if (subjectsQuery.error) return <DefaultErrorMessagePage />;

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <HelmetWithTracker title={t("htmlTitles.subjectsPage")} />
        <HeadingWrapper>
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("subjectsPage.allSubjects")}
          </Heading>
          {!!favoriteSubjects?.length && <FavoriteSubjects favorites={favoriteSubjects} subjects={sortedSubjects} />}
        </HeadingWrapper>
        <TabFilter value={selectedFilter} onChange={setFilter} options={filterOptions} />
        <LetterNavigation activeLetters={letters} />
        <StyledList aria-label={t("subjectsPage.alphabeticSort")}>
          {groupedSubjects.map(({ label, subjects }) => (
            <SubjectCategory favorites={favoriteSubjects} key={label} label={label} subjects={subjects} />
          ))}
        </StyledList>
      </main>
    </StyledPageContainer>
  );
};

export const Component = AllSubjectsPage;
