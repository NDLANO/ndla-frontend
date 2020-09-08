/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { SearchResultList, OneColumn } from '@ndla/ui';

import { searchQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import {
  convertResult,
  resultsWithContentTypeBadgeAndImage,
} from '../SearchPage/searchHelpers';
import handleError from '../../util/handleError';
import { ResourceShape } from '../../shapes';

const MovedResourcePage = ({ resource, locale, t }) => {
  const { data, loading, error } = useGraphQuery(searchQuery, {
    variables: { ids: resource.article.id.toString() },
  });

  if (loading) {
    return null;
  }

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  const convertedResults = convertResult(
    data.search.results,
    [],
    'all',
    locale,
  );
  const results = resultsWithContentTypeBadgeAndImage(convertedResults, t);

  return (
    <OneColumn>
      <h1>{t('movedResourcePage.title')}</h1>
      <div className="c-search-result">
        <SearchResultList results={results} />
      </div>
    </OneColumn>
  );
};

MovedResourcePage.propTypes = {
  resource: ResourceShape,
  locale: PropTypes.string.isRequired,
};

export default injectT(MovedResourcePage);
