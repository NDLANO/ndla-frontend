/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useTracker } from "@ndla/tracker";
import { SearchContainer } from "./SearchContainer";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import { GQLSearchResourceTypesQuery } from "../../graphqlTypes";
import { getAllDimensions } from "../../util/trackingUtil";

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

  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (authContextLoaded) {
      trackPageView({
        title: t("htmlTitles.searchPage"),
        dimensions: getAllDimensions({ user }),
      });
    }
  }, [authContextLoaded, t, trackPageView, user]);

  return (
    <PageContainer>
      <title>{t("htmlTitles.searchPage")}</title>
      <SearchContainer
        resourceTypes={resourceTypesQuery.data?.resourceTypes ?? []}
        resourceTypesLoading={resourceTypesQuery.loading}
      />
    </PageContainer>
  );
};

export const Component = SearchPage;
