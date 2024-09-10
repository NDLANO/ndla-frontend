/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import queryString from "query-string";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { constants } from "@ndla/ui";
import { converSearchStringToObject, convertSearchParam } from "./searchHelpers";
import SearchInnerPage from "./SearchInnerPage";
import { AuthContext } from "../../components/AuthenticationContext";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { PageContainer } from "../../components/Layout/PageContainer";
import { GQLSearchPageQuery } from "../../graphqlTypes";
import { searchPageQuery } from "../../queries";
import { useGraphQuery } from "../../util/runQueries";
import { searchSubjects } from "../../util/searchHelpers";
import { getAllDimensions } from "../../util/trackingUtil";

const getStateSearchParams = (searchParams: Record<string, any>) => {
  const stateSearchParams: Record<string, any> = {};
  Object.keys(searchParams).forEach((key) => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = converSearchStringToObject(location, i18n.language);

  const { data, loading } = useGraphQuery<GQLSearchPageQuery>(searchPageQuery);

  const sortedArchivedRemovedSubjects = useMemo(() => {
    return sortBy(
      data?.subjects?.filter(
        (s) => s.metadata.customFields.subjectCategory !== constants.subjectCategories.ARCHIVE_SUBJECTS,
      ),
      (s) => s.name,
    );
  }, [data?.subjects]);

  useEffect(() => {
    if (!loading && authContextLoaded) {
      trackPageView({
        title: t("htmlTitles.searchPage"),
        dimensions: getAllDimensions({ user }),
      });
    }
  }, [authContextLoaded, loading, t, trackPageView, user]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  const subjectItems = searchSubjects(searchParams.query, sortedArchivedRemovedSubjects, searchParams.subjects);

  const handleSearchParamsChange = (searchParams: Record<string, any>) => {
    navigate({
      pathname: "/search",
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams(searchParams),
      }),
    });
  };

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.searchPage")} />
      <PageContainer>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjectIds={searchParams.subjects}
          selectedFilters={searchParams.selectedFilters?.split(",") ?? ["all"]}
          activeSubFilters={searchParams.activeSubFilters?.split(",") ?? []}
          subjectItems={subjectItems}
          subjects={data?.subjects}
          resourceTypes={data?.resourceTypes}
          location={location}
        />
      </PageContainer>
    </>
  );
};

export default SearchPage;
