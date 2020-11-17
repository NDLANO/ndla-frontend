/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, arrayOf, shape, string, number, bool } from 'prop-types';
import { SearchTypeResult, constants } from '@ndla/ui';
import Pager from '@ndla/pager';
import { injectT } from '@ndla/i18n';
import {
  ArticleResultShape,
  LtiDataShape,
  SearchParamsShape,
} from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';

const { contentTypes } = constants;

const SearchResults = ({
  currentSubjectType, 
  searchItems,
  typeFilter
 }) => {
  return searchItems.map(searchItem => {
      const { totalCount, type } = searchItem;
      let pagination = null;
      if (currentSubjectType !== type || type === contentTypes.SUBJECT) {
        const toCount =
          typeFilter[type].pageSize > totalCount
            ? totalCount
            : typeFilter[type].pageSize;
        pagination = {
          totalCount,
          toCount,
          onShowMore: () => {},
          onShowAll: () => {},
        };
      }

    return (
      <Fragment key={`searchresult-${searchItem.type}`}>
        <SearchTypeResult
          filters={[]}
          onFilterClick={() => {}}
          items={searchItem.items}
          loading={false}
          type={searchItem.type}
          totalCount={searchItem.totalCount}
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
    )
  });
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
