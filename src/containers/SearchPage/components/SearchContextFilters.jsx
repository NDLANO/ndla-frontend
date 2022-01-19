/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { SearchFilter } from '@ndla/ui';
import { func, arrayOf, string } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SearchParamsShape } from '../../../shapes';
import { GraphqlResourceTypeWithsubtypesShape } from '../../../graphqlShapes';

const SearchContextFilters = ({
  searchParams,
  onUpdateContextFilters,
  resourceTypes,
  allTabValue,
  enabledTab,
}) => {
  const { t } = useTranslation();
  if (
    enabledTab === 'urn:resourcetype:learningPath' ||
    enabledTab === 'topic-article' ||
    enabledTab === allTabValue ||
    !enabledTab
  ) {
    return null;
  }
  const resourceType =
    resourceTypes?.find(type => type.id === enabledTab) || {};
  const subtypes = resourceType?.subtypes || [];

  return (
    <SearchFilter
      contextFilter
      label={t('searchPage.abilities')}
      onChange={onUpdateContextFilters}
      options={subtypes.map(subType => ({
        title: subType.name,
        value: subType.id,
      }))}
      values={searchParams.contextFilters}
    />
  );
};

SearchContextFilters.propTypes = {
  searchParams: SearchParamsShape,
  enabledTab: string.isRequired,
  allTabValue: string.isRequired,
  resourceTypes: arrayOf(GraphqlResourceTypeWithsubtypesShape),
  onUpdateContextFilters: func,
};

export default SearchContextFilters;
