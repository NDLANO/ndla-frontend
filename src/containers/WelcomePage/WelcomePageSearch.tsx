/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { FrontpageSearch } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';

import handleError from '../../util/handleError';
import { frontpageSearchQuery } from '../../queries';

import {
  frontPageSearchSuggestion,
  mapSearchToFrontPageStructure,
} from '../../util/searchHelpers';
import { toSearch } from '../../routeHelpers';

import { searchResultToLinkProps } from '../SearchPage/searchHelpers';
import { RouteComponentProps } from 'react-router';
import { LocaleType } from '../../interfaces';

const debounceCall = debounce((fn: ()=> void) => fn(), 300);

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

const WelcomePageSearch = ({ t, history, locale }: Props & tType) => {
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedSearchQuery] = useState('');
  const [inputHasFocus, setInputHasFocus] = useState(false);

  const [runSearch, { loading, data: searchResult, error }] = useLazyQuery(
    frontpageSearchQuery, {fetchPolicy: 'no-cache'}
  );

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
        },
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
    return <>{`Error: ${error.message}`}</>;
  }

  const onSearch = (evt: React.FormEvent) => {
    evt.preventDefault();
    history.push(allResultsUrl);
  };

  const headerMessages = {
    searchFieldTitle: t('welcomePage.heading.messages.searchFieldTitle'),
    menuButton: t('welcomePage.heading.messages.menuButton'),
    closeSearchLabel:'',
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

export default injectT(WelcomePageSearch);
