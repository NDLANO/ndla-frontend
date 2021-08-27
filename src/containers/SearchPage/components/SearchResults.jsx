/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { func, arrayOf, objectOf, bool } from 'prop-types';
import { SearchTypeResult, constants } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { SearchGroupShape, TypeFilterShape } from '../../../shapes';
import { getDefaultLocale } from '../../../config';

const { contentTypes } = constants;

const SearchResults = ({
  showAll,
  handleFilterClick,
  handleShowMore,
  searchGroups,
  typeFilter,
  loading,
}) => {
  const { i18n } = useTranslation();
  const defaultLanguage = getDefaultLocale();
  return searchGroups.map(group => {
    const { totalCount, type, items, resourceTypes } = group;
    if (
      (showAll || typeFilter[type].selected || type === contentTypes.SUBJECT) &&
      items.length
    ) {
      const internationalizedItems = items.map(item => {
        const url =
          i18n.language === defaultLanguage
            ? item.url
            : item.url.replace(
                'article-iframe/',
                `article-iframe/${i18n.language}/`,
              );
        return {
          ...item,
          url,
        };
      });
      return (
        <Fragment key={`searchresult-${type}`}>
          <SearchTypeResult
            filters={typeFilter[type].filters?.filter(
              filter =>
                resourceTypes.includes(filter.id) || filter.id === 'all',
            )}
            onFilterClick={id => handleFilterClick(type, id)}
            items={internationalizedItems}
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
  showAll: bool,
  handleFilterClick: func,
  handleShowMore: func,
  searchGroups: arrayOf(SearchGroupShape),
  typeFilter: objectOf(TypeFilterShape),
};

export default SearchResults;
