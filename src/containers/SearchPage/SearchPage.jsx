/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, number, string, shape } from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';

import { searchPageQuery, conceptSearchQuery } from '../../queries';
import { LocationShape } from '../../shapes';
import SearchInnerPage from './SearchInnerPage';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';
import { searchSubjects } from '../../util/searchHelpers';
import { useGraphQuery } from '../../util/runQueries';

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchPage = ({ location, locale, history, t }) => {
  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);
  const subjects = searchSubjects(searchParams.query);
  const subjectItems = subjects.map(subject => ({
    id: subject.id,
    title: subject.name,
    url: subject.path,
  }));

  const { data, loading } = useGraphQuery(searchPageQuery);
  const { data: conceptData } = useGraphQuery(conceptSearchQuery, {
    skip: !searchParams.query,
    variables: stateSearchParams,
  });

  const handleSearchParamsChange = searchParams => {
    history.push({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...getStateSearchParams(searchParams),
      }),
    });
  };

  if (loading) {
    return null;
  }

  const allSubjects =
    data.subjects?.map(subject => ({
      title: subject.name,
      value: subject.id,
    })) || [];

  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchPage')} />
      <OneColumn cssModifier="clear-desktop" wide>
        <SearchInnerPage
          handleSearchParamsChange={handleSearchParamsChange}
          query={searchParams.query}
          subjects={searchParams.subjects}
          allSubjects={allSubjects}
          subjectItems={subjectItems}
          concepts={conceptData?.conceptSearch}
          resourceTypes={data.resourceTypes}
          location={location}
          locale={locale}
        />
      </OneColumn>
    </Fragment>
  );
};

SearchPage.propTypes = {
  location: LocationShape,
  locale: string,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  resultMetadata: shape({
    totalCount: number,
    lastPage: number,
  }),
  match: shape({
    params: shape({
      subjectId: string,
    }),
  }),
};

export default injectT(withRouter(SearchPage));
