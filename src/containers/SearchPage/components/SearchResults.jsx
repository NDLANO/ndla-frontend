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
  handleFilterClick,
  handleShowAll,
  handleShowMore,
  onPagerNavigate,
  searchGroups,
  typeFilter
}) => {
  return searchGroups.map(group => {
    const { totalCount, type, items, loading } = group;
    if (!currentSubjectType || type === currentSubjectType) {
      let pagination = null;
      if (currentSubjectType !== type || type === contentTypes.SUBJECT) {
        const toCount =
          typeFilter?.[type]?.pageSize > totalCount
            ? totalCount
            : typeFilter[type].pageSize;
        pagination = {
          totalCount,
          toCount,
          onShowMore: () => handleShowMore(type),
          onShowAll: () => handleShowAll(type),
        };
      }

      return (
        <Fragment key={`searchresult-${type}`}>
          <SearchTypeResult
            filters={typeFilter[type].filters}
            onFilterClick={id => handleFilterClick(type, id)}
            items={items}
            loading={loading}
            type={type}
            totalCount={totalCount}
            pagination={pagination}>
            {!pagination && (
              <Pager
                page={typeFilter[type].page}
                lastPage={Math.ceil(totalCount / typeFilter[type].pageSize)}
                query={{ type }}
                pageItemComponentClass="button"
                pathname="#"
                onClick={onPagerNavigate}
              />
            )}
          </SearchTypeResult>
        </Fragment>
      )
    }
    return null;
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
