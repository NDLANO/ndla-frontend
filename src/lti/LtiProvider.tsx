/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useApolloClient } from "@apollo/client";
import { styled } from "@ndla/styled-system/jsx";
import { setCookie } from "@ndla/util";

import { PageLayout } from "../components/Layout/PageContainer";
import { useLtiData } from "../components/LtiContext";
import { RESOURCE_TYPE_LEARNING_PATH, STORED_LANGUAGE_COOKIE_KEY } from "../constants";
import { PageErrorBoundary } from "../containers/ErrorPage/ErrorBoundary";
import ErrorPage from "../containers/ErrorPage/ErrorPage";
import SearchInnerPage from "../containers/SearchPage/SearchInnerPage";
import { GQLSearchPageQuery } from "../graphqlTypes";
import { LocaleType } from "../interfaces";
import { searchPageQuery } from "../queries";
import { createApolloLinks } from "../util/apiHelpers";
import handleError from "../util/handleError";
import { useGraphQuery } from "../util/runQueries";

const StyledPageLayout = styled(PageLayout, {
  base: {
    paddingBlockStart: "xxlarge",
    paddingBlockEnd: "5xlarge",
  },
});

interface Props {
  locale?: LocaleType;
}

interface SearchParams {
  query?: string;
  subjects: string[];
  programs: string[];
  selectedFilters: string[];
  activeSubFilters: string[];
}
const LtiProvider = ({ locale: propsLocale }: Props) => {
  const ltiContext = useLtiData();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    subjects: [],
    programs: [],
    selectedFilters: [],
    activeSubFilters: [],
  });
  const { t, i18n } = useTranslation();
  const locale = propsLocale ?? i18n.language;

  const { data, error, loading } = useGraphQuery<GQLSearchPageQuery>(searchPageQuery);
  const client = useApolloClient();

  i18n.on("languageChanged", (lang) => {
    client.resetStore();
    client.setLink(createApolloLinks(lang));
    setCookie({
      cookieName: STORED_LANGUAGE_COOKIE_KEY,
      cookieValue: lang,
      lax: true,
    });
    document.documentElement.lang = lang;
  });

  const handleSearchParamsChange = (searchParamUpdates: { selectedFilters?: string[] }) => {
    const selectedFilters = searchParamUpdates.selectedFilters ?? [];
    setSearchParams((prevState) => ({
      ...prevState,
      ...searchParamUpdates,
      selectedFilters,
    }));
  };

  if (loading) {
    return null;
  }

  if (error && !data) {
    handleError(error);
    return <ErrorPage />;
  }

  return (
    <PageErrorBoundary>
      <Helmet htmlAttributes={{ lang: locale === "nb" ? "no" : locale }}>
        <title>{`${t("htmlTitles.lti")}`}</title>
      </Helmet>
      <StyledPageLayout>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjectIds={searchParams.subjects}
          selectedFilters={searchParams.selectedFilters.length ? searchParams.selectedFilters : ["all"]}
          activeSubFilters={searchParams.activeSubFilters}
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
