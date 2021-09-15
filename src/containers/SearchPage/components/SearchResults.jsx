/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, arrayOf, objectOf, bool } from 'prop-types';
import { SearchTypeResult, constants } from '@ndla/ui';
import { SearchGroupShape, TypeFilterShape } from '../../../shapes';

const { contentTypes } = constants;

const SearchResults = ({
  showAll,
  handleFilterClick,
  handleShowMore,
  searchGroups,
  typeFilter,
  loading,
}) => {
  return searchGroups.map(group => {
    const { totalCount, type, items, resourceTypes } = group;
    if (
      (showAll || typeFilter[type].selected || type === contentTypes.SUBJECT) &&
      items.length
    ) {
      const toCount = typeFilter[type].page * typeFilter[type].pageSize;

      return (
        <Fragment key={`searchresult-${type}`}>
          <SearchTypeResult
            filters={typeFilter[type].filters?.filter(
              filter =>
                resourceTypes.includes(filter.id) || filter.id === 'all',
            )}
            onFilterClick={id => handleFilterClick(type, id)}
            items={items}
            loading={loading}
            pagination={{
              totalCount,
              toCount,
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
  showAll: bool,
  handleFilterClick: func,
  handleShowMore: func,
  searchGroups: arrayOf(SearchGroupShape),
  typeFilter: objectOf(TypeFilterShape),
};

export default SearchResults;
