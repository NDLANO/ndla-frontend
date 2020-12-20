/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, arrayOf, objectOf, string } from 'prop-types';
import { SearchTypeResult, constants } from '@ndla/ui';
import { SearchGroupShape, TypeFilterShape } from '../../../shapes';

const { contentTypes } = constants;

const SearchResults = ({
  currentSubjectType,
  handleFilterClick,
  handleShowMore,
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
      return (
        <Fragment key={`searchresult-${type}`}>
          <SearchTypeResult
            filters={typeFilter[type].filters}
            onFilterClick={id => handleFilterClick(type, id)}
            items={items}
            loading={loading}
            pagination={{
              totalCount,
              toCount: items.length,
              onShowMore: () => handleShowMore(type),
            }}
            type={type === 'topic-article' ? 'topic' : type}
            totalCount={totalCount}></SearchTypeResult>
        </Fragment>
      );
    }
    return null;
  });
};

SearchResults.propTypes = {
  currentSubjectType: string,
  handleFilterClick: func,
  handleShowMore: func,
  searchGroups: arrayOf(SearchGroupShape),
  typeFilter: objectOf(TypeFilterShape),
};

export default SearchResults;
