/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { ContentPlaceholder, OneColumn } from '@ndla/ui';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useContext, useEffect } from 'react';
import { searchPageQuery } from '../../queries';
import SearchInnerPage from './SearchInnerPage';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { GQLSearchPageQuery } from '../../graphqlTypes';
import { AuthContext } from '../../components/AuthenticationContext';
import { getAllDimensions } from '../../util/trackingUtil';

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
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = converSearchStringToObject(location, i18n.language);

  const { data, loading } = useGraphQuery<GQLSearchPageQuery>(searchPageQuery);

  useEffect(() => {
    if (!loading) {
      trackPageView({
        title: t('htmlTitles.searchPage'),
        dimensions: getAllDimensions({ user }),
      });
    }
  }, [loading, t, trackPageView, user]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  const subjectItems = searchSubjects(searchParams.query, data?.subjects);

  const handleSearchParamsChange = (searchParams: Record<string, any>) => {
    navigate({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams(searchParams),
      }),
    });
  };

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjectIds={searchParams.subjects}
          programmeNames={searchParams.programs}
          selectedFilters={searchParams.selectedFilters?.split(',') ?? []}
          activeSubFilters={searchParams.activeSubFilters?.split(',') ?? []}
          subjectItems={subjectItems}
          subjects={data?.subjects}
          resourceTypes={data?.resourceTypes}
          location={location}
        />
      </OneColumn>
    </>
  );
};

export default SearchPage;
