/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useApolloClient, useQuery } from "@apollo/client";
import { styled } from "@ndla/styled-system/jsx";
import { setCookie } from "@ndla/util";
import { DefaultErrorMessagePage } from "../components/DefaultErrorMessage";
import { PageLayout } from "../components/Layout/PageContainer";
import { useLtiData } from "../components/LtiContext";
import { RESOURCE_TYPE_LEARNING_PATH, STORED_LANGUAGE_COOKIE_KEY } from "../constants";
import { PageErrorBoundary } from "../containers/ErrorPage/ErrorBoundary";
import { converSearchStringToObject } from "../containers/SearchPage/searchHelpers";
import SearchInnerPage, { getStateSearchParams } from "../containers/SearchPage/SearchInnerPage";
import { GQLSearchPageQuery } from "../graphqlTypes";
import { getLangAttributeValue } from "../i18n";
import { searchPageQuery } from "../queries";
import { createApolloLinks } from "../util/apiHelpers";
import handleError from "../util/handleError";

const StyledPageLayout = styled(PageLayout, {
  base: {
    paddingBlockStart: "xxlarge",
    paddingBlockEnd: "5xlarge",
  },
});

interface SearchParams {
  query?: string;
  subjects: string[];
  programs: string[];
  selectedFilters: string[];
  activeSubFilters: string[];
}
const LtiProvider = () => {
  const ltiContext = useLtiData();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = converSearchStringToObject(location);

  const { t, i18n } = useTranslation();

  const { data, error, loading } = useQuery<GQLSearchPageQuery>(searchPageQuery);
  const client = useApolloClient();

  i18n.on("languageChanged", (lang) => {
    client.resetStore();
    client.setLink(createApolloLinks(lang));
    setCookie({
      cookieName: STORED_LANGUAGE_COOKIE_KEY,
      cookieValue: lang,
      lax: true,
    });
    document.documentElement.lang = getLangAttributeValue(lang);
  });

  const handleSearchParamsChange = (searchParamUpdates: Partial<SearchParams>) => {
    navigate({
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams({ ...searchParams, ...searchParamUpdates }),
      }),
    });
  };

  if (loading) {
    return null;
  }

  if (error && !data) {
    handleError(error);
    return <DefaultErrorMessagePage />;
  }

  return (
    <PageErrorBoundary>
      <title>{`${t("htmlTitles.lti")}`}</title>
      <StyledPageLayout>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjectIds={searchParams.subjects}
          selectedFilters={searchParams.selectedFilters?.split(",") ?? ["all"]}
          activeSubFilters={searchParams.activeSubFilters?.split(",") ?? []}
          subjects={data?.subjects}
          subjectItems={[]}
          resourceTypes={data?.resourceTypes?.filter((type) => type.id !== RESOURCE_TYPE_LEARNING_PATH)}
          ltiData={ltiContext?.ltiData}
          isLti
        />
      </StyledPageLayout>
    </PageErrorBoundary>
  );
};

export default LtiProvider;
