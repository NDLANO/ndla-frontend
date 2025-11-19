/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { CloseLine } from "@ndla/icons";
import { Button, Heading, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import { GQLGrepFilterQuery, GQLGrepFilterQueryVariables } from "../../graphqlTypes";

const FiltersWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

// const CompetenceWrapper = styled("div", {
//   base: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "small",
//   },
// });
// const CompetenceItemWrapper = styled("div", {
//   base: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "xxsmall",
//   },
// });

const grepFilterQuery = gql`
  query grepFilter($codes: [String!]) {
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
    }
  }
`;

export const GrepFilter = () => {
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const { t } = useTranslation();
  const codes = useMemo(() => searchParams.get("grepCodes")?.split(",") ?? [], [searchParams]);

  const grepQuery = useQuery<GQLGrepFilterQuery, GQLGrepFilterQueryVariables>(grepFilterQuery, {
    variables: { codes },
    skip: !codes.length,
  });

  // const groupedCompetenceGoals = useMemo(() => {
  //   return groupCompetenceGoals(grepQuery.data?.competenceGoals ?? [], true, "LK20");
  // }, [grepQuery.data?.competenceGoals]);
  //
  // const mappedCoreElements = useMemo(() => {
  //   return (
  //     grepQuery.data?.coreElements?.map((element) => ({
  //       title: element.title,
  //       text: element.description ?? "",
  //       id: element.id,
  //       url: "",
  //     })) ?? []
  //   );
  // }, [grepQuery.data?.coreElements]);

  const data = grepQuery.data ?? grepQuery.previousData;

  const grepElements = useMemo(
    () => [data?.competenceGoals, data?.coreElements].filter((arr) => !!arr).flat(),
    [data?.competenceGoals, data?.coreElements],
  );

  const onRemoveCode = useCallback(
    (value: string) => {
      const newCodes = codes.filter((code) => code !== value);
      setSearchParams({ grepCodes: newCodes.join(",") });
    },
    [codes, setSearchParams],
  );

  if (!grepQuery.loading && !grepQuery.data?.competenceGoals?.length && !grepQuery.data?.coreElements?.length) {
    return;
  }

  return (
    <FilterContainer>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h3>{t("searchPage.grepFilter.heading")}</h3>
      </Heading>
      {/* <CompetenceWrapper> */}
      {/*   {!!groupedCompetenceGoals?.length && ( */}
      {/*     <CompetenceItemWrapper> */}
      {/*       <Heading textStyle="title.large" asChild consumeCss> */}
      {/*         <h4>{t("competenceGoals.competenceGoalItem.title")}</h4> */}
      {/*       </Heading> */}
      {/*       {groupedCompetenceGoals.map((goal, index) => ( */}
      {/*         <CompetenceItem item={goal} key={index} /> */}
      {/*       ))} */}
      {/*     </CompetenceItemWrapper> */}
      {/*   )} */}
      {/*   {!!grepQuery.data?.coreElements?.length && ( */}
      {/*     <CompetenceItemWrapper> */}
      {/*       <Heading textStyle="title.large" asChild consumeCss> */}
      {/*         <h2>{t("competenceGoals.competenceTabCorelabel")}</h2> */}
      {/*       </Heading> */}
      {/*       <CompetenceItem item={{ elements: mappedCoreElements }} /> */}
      {/*     </CompetenceItemWrapper> */}
      {/*   )} */}
      {/* </CompetenceWrapper> */}
      {!!grepQuery.loading && !grepQuery.previousData && <Spinner />}
      <FiltersWrapper>
        {codes.map((grep) => {
          const item = grepElements.find((g) => g.id === grep);
          if (!item) return null;
          return (
            <Button
              key={item.id}
              size="small"
              variant="primary"
              onClick={() => onRemoveCode(item.id)}
              aria-label={t("searchPage.grepFilter.removeFilter", { code: item.id, title: item.title })}
              title={t("searchPage.grepFilter.removeFilter", { code: item.id, title: item.title })}
            >
              {item.id}
              {" - "}
              {item.title}
              <CloseLine />
            </Button>
          );
        })}
      </FiltersWrapper>
    </FilterContainer>
  );
};
