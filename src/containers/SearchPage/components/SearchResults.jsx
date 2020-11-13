/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useReducer, Fragment } from 'react';
import { func, arrayOf, shape, string, number, bool } from 'prop-types';
import { SearchTypeResult } from '@ndla/ui';
import Pager from '@ndla/pager';
import { injectT } from '@ndla/i18n';
import {
  ArticleResultShape,
  LtiDataShape,
  SearchParamsShape,
} from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';

const SearchResults = ({
  searchItems,
}) => {

  const pagination = {
    totalCount: 123,
    toCount: 12,
    onShowMore: () => {},
    onShowAll: () => {},
  };

  return searchItems
    .map(searchItem => (
      <Fragment key={`searchresult-${searchItem.type}`}>
        <SearchTypeResult
          filters={[]}
          onFilterClick={() => {}}
          items={searchItem.items}
          loading={false}
          type={searchItem.type}
          totalCount={123}
          pagination={pagination}>
          {!pagination && (
            <Pager
              page={1}
              lastPage={2}
              query={{ type: searchItem.type }}
              pageItemComponentClass="button"
              pathname="#"
              onClick={() => {}}
            />
          )}
        </SearchTypeResult>
      </Fragment>
    ))

};

SearchResults.propTypes = {
  searchParams: SearchParamsShape,
  query: string,
  enabledTabs: arrayOf(
    shape({
      name: string,
      value: string,
      type: string,
    }),
  ),
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onTabChange: func,
  results: arrayOf(ArticleResultShape),
  resultMetadata: shape({
    totalCount: number,
  }),
  allTabValue: string.isRequired,
  onUpdateContextFilters: func,
  includeEmbedButton: bool,
  ltiData: LtiDataShape,
  enabledTab: string.isRequired,
  loading: bool,
  isLti: bool,
};

export default injectT(SearchResults);
