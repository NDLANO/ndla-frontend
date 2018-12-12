/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchFilter } from '@ndla/ui';
import { func, arrayOf, shape, string } from 'prop-types';
import { injectT } from '@ndla/i18n';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';

const SearchContextFilters = ({
  filterState,
  // enabledTab,
  onUpdateContextFilters,
  resourceTypes,
  allTabValue,
  t,
}) => {
  const enabledTab = filterState.resourceTypes || filterState.contextTypes;

  if (
    enabledTab === 'urn:resourcetype:learningPath' ||
    enabledTab === 'topic-article' ||
    enabledTab === allTabValue ||
    !enabledTab
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
      values={
        filterState.contextFilters ? filterState.contextFilters.split(',') : []
      }
    />
  );
};

SearchContextFilters.propTypes = {
  filterState: shape({
    resourceTypes: string,
    subjects: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
    contextFilters: string,
  }),
  allTabValue: string.isRequired,
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onUpdateContextFilters: func,
};

export default injectT(SearchContextFilters);
