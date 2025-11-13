/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { SearchContainer } from "./SearchContainer";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { GQLSearchResourceTypesQuery } from "../../graphqlTypes";

const searchResourceTypesQuery = gql`
  query searchResourceTypes {
    resourceTypes {
      ...SearchContainer_ResourceTypeDefinition
    }
  }
  ${SearchContainer.fragments.resourceTypeDefinition}
`;

export const SearchPage = () => {
  const { t } = useTranslation();

  const resourceTypesQuery = useQuery<GQLSearchResourceTypesQuery>(searchResourceTypesQuery);

  return (
    <PageContainer>
      <PageTitle title={t("htmlTitles.searchPage")} />
      <SearchContainer
        resourceTypes={resourceTypesQuery.data?.resourceTypes ?? []}
        resourceTypesLoading={resourceTypesQuery.loading}
      />
    </PageContainer>
  );
};

export const Component = SearchPage;
