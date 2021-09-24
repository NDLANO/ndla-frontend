/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FrontpageSearch } from '@ndla/ui';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';

import handleError from '../../util/handleError';
import { frontpageSearchQuery } from '../../queries';
import {
  frontPageSearchSuggestion,
  mapSearchToFrontPageStructure,
} from '../../util/searchHelpers';
import { toSearch } from '../../routeHelpers';
import { searchResultToLinkProps } from '../SearchPage/searchHelpers';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

const debounceCall = debounce(fn => fn(), 300);

const WelcomePageSearch = ({ history, locale }) => {
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const { t } = useTranslation();

  const [runSearch, { loading, data: searchResult, error }] = useLazyQuery(
    frontpageSearchQuery,
  );

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
        },
        fetchPolicy: 'no-cache',
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearchFieldChange = query => {
    setQuery(query);
    debounceCall(() => setDelayedSearchQuery(query));
  };

  const allResultsUrl = toSearch(`query=${query}`);

  const suggestion = searchResult && frontPageSearchSuggestion(searchResult);
  const suggestionUrl = toSearch(`query=${suggestion}`);

  if (error) {
    handleError(error);
    return <DefaultErrorMessage minimal />;
  }

  const onSearch = evt => {
    evt.preventDefault();
    history.push(allResultsUrl);
  };

  const headerMessages = {
    searchFieldTitle: t('welcomePage.heading.messages.searchFieldTitle'),
    menuButton: t('welcomePage.heading.messages.menuButton'),
  };

  return (
    <FrontpageSearch
      inputHasFocus={inputHasFocus}
      onInputBlur={() => setInputHasFocus(false)}
      messages={headerMessages}
      searchFieldValue={query}
      onSearch={onSearch}
      onSearchFieldChange={onSearchFieldChange}
      searchFieldPlaceholder={t('welcomePage.heading.searchFieldPlaceholder')}
      searchResult={
        searchResult &&
        delayedSearchQuery.length >= 2 &&
        mapSearchToFrontPageStructure(
          searchResult,
          t,
          delayedSearchQuery,
          locale,
        )
      }
      onSearchInputFocus={() => setInputHasFocus(true)}
      allResultUrl={allResultsUrl}
      loading={loading}
      resourceToLinkProps={searchResultToLinkProps}
      history={history}
      suggestion={searchResult && delayedSearchQuery.length >= 2 && suggestion}
      suggestionUrl={suggestionUrl}
    />
  );
};

WelcomePageSearch.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string,
};

export default WelcomePageSearch;
