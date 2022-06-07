/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { ContentPlaceholder, OneColumn } from '@ndla/ui';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { searchPageQuery } from '../../queries';
import SearchInnerPage from './SearchInnerPage';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { GQLSearchPageQuery } from '../../graphqlTypes';

const getStateSearchParams = (searchParams: Record<string, any>) => {
  const stateSearchParams: Record<string, any> = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchPage = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = converSearchStringToObject(location, i18n.language);
  //const stateSearchParams = getStateSearchParams(searchParams);
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const { data, loading } = useGraphQuery<GQLSearchPageQuery>(searchPageQuery);
  /*const { data: conceptData } = useGraphQuery<GQLConceptSearchQuery>(
    conceptSearchQuery,
    {
      skip: !searchParams.query,
      variables: {
        ...stateSearchParams,
        exactMatch: true,
        fallback: true,
      },
    },
  );*/

  const handleSearchParamsChange = (searchParams: Record<string, any>) => {
    navigate({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams(searchParams),
      }),
    });
  };

  if (loading) {
    return <ContentPlaceholder />;
  }

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjects={searchParams.subjects ?? []}
          programmes={searchParams.programs ?? []}
          selectedFilters={searchParams.selectedFilters?.split(',') ?? []}
          activeSubFilters={searchParams.activeSubFilters?.split(',') ?? []}
          subjectItems={subjectItems}
          //concepts={conceptData?.conceptSearch?.concepts} // Save for later
          concepts={undefined}
          resourceTypes={data?.resourceTypes}
          location={location}
        />
      </OneColumn>
    </>
  );
};

export default SearchPage;
