/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldsetLegend,
  FieldsetRoot,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { sortBy } from "@ndla/util";
import { FavoriteSubjects } from "./FavoriteSubjects";
import { LetterNavigation } from "./LetterNavigation";
import { SubjectCategory } from "./SubjectCategory";
import { useNavigateToHash } from "../../components/Article/articleHelpers";
import { AuthContext } from "../../components/AuthenticationContext";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { TabFilter } from "../../components/TabFilter";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLAllSubjectsQuery, GQLAllSubjectsQueryVariables } from "../../graphqlTypes";
import { createFilters, groupAndFilterSubjectsByCategory } from "../../util/subjectFilter";
import { useStableSearchParams } from "../../util/useStableSearchParams";

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

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: {
    flexDirection: "row",
  },
});

const FilterWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    gap: "small",
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

export const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchParams();
  const { user } = useContext(AuthContext);

  useNavigateToHash(undefined);

  const subjectsQuery = useQuery<GQLAllSubjectsQuery, GQLAllSubjectsQueryVariables>(allSubjectsQuery);

  const filterOptions = useMemo(() => createFilters(t), [t]);
  const subFilters = useMemo(() => params.get("subFilters")?.split(",") ?? [], [params]);
  const selectedFilter = useMemo(() => {
    return filterOptions.find((opt) => opt.value === params.get("filter")) ?? filterOptions[0]!;
  }, [filterOptions, params]);

  const setFilter = (value: string) => {
    setParams({ filter: value, subFilters: undefined }, { replace: true });
  };

  const favoriteSubjects = user?.favoriteSubjects;
  const sortedSubjects = useMemo(() => sortBy(subjectsQuery.data?.nodes, (s) => s.name), [subjectsQuery.data?.nodes]);
  const groupedSubjects = useMemo(
    () => groupAndFilterSubjectsByCategory(selectedFilter.value, subFilters, sortedSubjects),
    [sortedSubjects, selectedFilter.value, subFilters],
  );

  const letters = useMemo(() => groupedSubjects.map((group) => group.label), [groupedSubjects]);

  if (subjectsQuery.loading) return <ContentPlaceholder />;
  if (subjectsQuery.error) return <DefaultErrorMessagePage />;

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <PageTitle title={t("htmlTitles.subjectsPage")} />
        <HeadingWrapper>
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("subjectsPage.allSubjects")}
          </Heading>
          {!!favoriteSubjects?.length && <FavoriteSubjects favorites={favoriteSubjects} subjects={sortedSubjects} />}
        </HeadingWrapper>
        <FilterWrapper>
          <TabFilter value={selectedFilter.value} onChange={setFilter} options={filterOptions} />
          {!!selectedFilter.subfilters.length && (
            <StyledFieldsetRoot>
              <FieldsetLegend>{t("subjectsPage.subcategory")}</FieldsetLegend>
              <StyledCheckboxGroup
                value={subFilters}
                onValueChange={(details) => setParams({ subFilters: details.join(",") })}
              >
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
              </StyledCheckboxGroup>
            </StyledFieldsetRoot>
          )}
        </FilterWrapper>
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
