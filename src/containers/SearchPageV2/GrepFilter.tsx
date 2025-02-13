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
import { Button, Heading, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import { GQLGrepFilterQuery, GQLGrepFilterQueryVariables } from "../../graphqlTypes";
import { useStableSearchParams } from "../../util/useStableSearchParams";

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
  query grepFilter($codes: [String!], $language: String!) {
    competenceGoals(codes: $codes, language: $language) {
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
    coreElements(codes: $codes, language: $language) {
      id
      title
      description
    }
  }
`;

export const GrepFilter = () => {
  const [searchParams, setSearchParams] = useStableSearchParams();
  const { t, i18n } = useTranslation();

  const codes = useMemo(() => searchParams.get("grepCodes")?.split(",") ?? [], [searchParams]);

  const grepQuery = useQuery<GQLGrepFilterQuery, GQLGrepFilterQueryVariables>(grepFilterQuery, {
    variables: { language: i18n.language, codes },
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

  const grepElements = useMemo(
    () => [grepQuery.data?.competenceGoals, grepQuery.data?.coreElements].filter((arr) => !!arr).flat(),
    [grepQuery.data?.competenceGoals, grepQuery.data?.coreElements],
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
      {!!grepQuery.loading && <Spinner />}
      <FiltersWrapper>
        {grepElements.map((grep) => (
          <Button key={grep.id} size="small" variant="primary" onClick={() => onRemoveCode(grep.id)}>
            {grep.id}
            <CloseLine />
          </Button>
        ))}
      </FiltersWrapper>
    </FilterContainer>
  );
};
