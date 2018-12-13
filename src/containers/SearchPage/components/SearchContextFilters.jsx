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
  onUpdateContextFilters,
  resourceTypes,
  allTabValue,
  enabledTab,
  t,
}) => {
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
      values={filterState.contextFilters}
    />
  );
};

SearchContextFilters.propTypes = {
  filterState: shape({
    contextFilters: arrayOf(string),
    languageFilter: arrayOf(string),
    levels: arrayOf(string),
    page: string,
    resourceTypes: arrayOf(string),
    subjects: arrayOf(string),
  }),
  enabledTab: string.isRequired,
  allTabValue: string.isRequired,
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onUpdateContextFilters: func,
};

export default injectT(SearchContextFilters);
