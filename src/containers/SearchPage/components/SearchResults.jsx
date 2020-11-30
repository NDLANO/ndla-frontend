/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, arrayOf, objectOf, string } from 'prop-types';
import { SearchTypeResult, constants } from '@ndla/ui';
import Pager from '@ndla/pager';
import { SearchGroupShape, TypeFilterShape } from '../../../shapes';

const { contentTypes } = constants;

const SearchResults = ({
  currentSubjectType,
  handleFilterClick,
  handleShowAll,
  handleShowMore,
  onPagerNavigate,
  searchGroups,
  typeFilter,
}) => {
  return searchGroups.map(group => {
    const { totalCount, type, items, loading } = group;
    if (
      (!currentSubjectType ||
        type === currentSubjectType ||
        type === contentTypes.SUBJECT) &&
      items.length
    ) {
      let pagination = null;
      if (currentSubjectType !== type || type === contentTypes.SUBJECT) {
        const toCount =
          typeFilter[type].pageSize > totalCount
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
            items={items.slice(0, typeFilter[type].pageSize)}
            loading={loading}
            type={type === 'topic-article' ? 'topic' : type}
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
      );
    }
    return null;
  });
};

SearchResults.propTypes = {
  currentSubjectType: string,
  handleFilterClick: func,
  handleShowAll: func,
  handleShowMore: func,
  onPagerNavigate: func,
  searchGroups: arrayOf(SearchGroupShape),
  typeFilter: objectOf(TypeFilterShape),
};

export default SearchResults;
