/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql, useApolloClient, useQuery } from "@apollo/client";
import { styled } from "@ndla/styled-system/jsx";
import { PageLayout } from "../components/Layout/PageContainer";
import { PageErrorBoundary } from "../containers/ErrorPage/ErrorBoundary";
import { SearchContainer } from "../containers/SearchPage/SearchContainer";
import { GQLLtiSearchResourceTypesQuery } from "../graphqlTypes";
import { getLangAttributeValue } from "../i18n";
import { LtiContextProvider } from "../LtiContext";
import { createApolloLinks } from "../util/apiHelpers";

const StyledPageLayout = styled(PageLayout, {
  base: {
    paddingBlockStart: "xxlarge",
    paddingBlockEnd: "5xlarge",
  },
});

const searchResourceTypesQuery = gql`
  query ltiSearchResourceTypes {
    resourceTypes {
      ...SearchContainer_ResourceTypeDefinition
    }
  }
  ${SearchContainer.fragments.resourceTypeDefinition}
`;

export const Component = () => {
  const { t, i18n } = useTranslation();

  const client = useApolloClient();

  const resourceTypesQuery = useQuery<GQLLtiSearchResourceTypesQuery>(searchResourceTypesQuery);

  i18n.on("languageChanged", (lang) => {
    client.resetStore();
    client.setLink(createApolloLinks(lang));
    document.documentElement.lang = getLangAttributeValue(lang);
  });

  return (
    <PageErrorBoundary>
      <title>{`${t("htmlTitles.lti")}`}</title>
      <StyledPageLayout>
        <LtiContextProvider>
          <SearchContainer
            resourceTypes={
              // we don't want to show learning paths in LTI, as they cannot be embedded
              resourceTypesQuery.data?.resourceTypes?.filter((rt) => !rt.id.includes("learningPath")) ?? []
            }
            resourceTypesLoading={resourceTypesQuery.loading}
          />
        </LtiContextProvider>
      </StyledPageLayout>
    </PageErrorBoundary>
  );
};
