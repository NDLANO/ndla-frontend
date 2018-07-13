/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchFilter } from 'ndla-ui';
import { func, arrayOf, shape, string } from 'prop-types';
import { injectT } from 'ndla-i18n';
import { ArticleResultShape } from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';

const SearchContextFilters = ({
  results,
  filterState,
  onUpdateContextFilters,
  resourceTypes,
  t,
}) => {
  const enabledTab =
    filterState['resource-types'] || filterState['context-types'];

  if (
    enabledTab === 'urn:resourcetype:learningPath' ||
    enabledTab === 'topic-article' ||
    !enabledTab ||
    results.length === 0
  ) {
    return null;
  }
  const resourceType = resourceTypes
    ? resourceTypes.find(type => type.id === enabledTab)
    : {};
  const subtypes = resourceType ? resourceType.subtypes : [];
  return (
    <SearchFilter
      contextFilter
      label={t('searchPage.abilities')}
      onChange={onUpdateContextFilters}
      options={subtypes.map(subType => ({
        title: subType.name,
        value: subType.id,
      }))}
      values={filterState.contextFilters}
    />
  );
};

SearchContextFilters.propTypes = {
  filterState: shape({
    'resource-types': string,
    subjects: arrayOf(string),
    'language-filter': arrayOf(string),
    levels: arrayOf(string),
    contextFilters: arrayOf(string),
  }),
  results: arrayOf(ArticleResultShape).isRequired,
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onUpdateContextFilters: func,
};

export default injectT(SearchContextFilters);
