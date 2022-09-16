/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, FormEvent } from 'react';
import { FrontpageSearch } from '@ndla/ui';
import { useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import handleError from '../../util/handleError';
import { frontpageSearchQuery } from '../../queries';
import {
  frontPageSearchSuggestion,
  mapSearchToFrontPageStructure,
} from '../../util/searchHelpers';
import { toSearch } from '../../routeHelpers';
import { searchResultToLinkProps } from '../SearchPage/searchHelpers';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

const debounceCall = debounce((fn: () => void) => fn(), 300);

const WelcomePageSearch = () => {
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');
  const [inputHasFocus, setInputHasFocus] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [runSearch, { loading, data: searchResult, error }] = useLazyQuery(
    frontpageSearchQuery,
  );

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
        },
        //@ts-ignore
        fetchPolicy: 'no-cache',
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSearchFieldChange = (query: string) => {
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

  const onSearch = (evt: FormEvent) => {
    evt.preventDefault();
    navigate(allResultsUrl);
  };

  return (
    <FrontpageSearch
      inputHasFocus={inputHasFocus}
      onInputBlur={() => setInputHasFocus(false)}
      searchFieldValue={query}
      onSearch={onSearch}
      onSearchFieldChange={onSearchFieldChange}
      searchFieldPlaceholder={t('welcomePage.heading.searchFieldPlaceholder')}
      searchResult={
        searchResult &&
        delayedSearchQuery.length >= 2 &&
        mapSearchToFrontPageStructure(searchResult, t, delayedSearchQuery)
      }
      onSearchInputFocus={() => setInputHasFocus(true)}
      allResultUrl={allResultsUrl}
      loading={loading}
      resourceToLinkProps={searchResultToLinkProps}
      suggestion={searchResult && delayedSearchQuery.length >= 2 && suggestion}
      suggestionUrl={suggestionUrl}
    />
  );
};

export default WelcomePageSearch;
