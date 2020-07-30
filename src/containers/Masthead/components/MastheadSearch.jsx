import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  SearchField,
  SearchResultSleeve,
  SearchFieldForm,
  MastheadSearchModal,
} from '@ndla/ui';
import queryString from 'query-string';
import { useLazyQuery } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { injectT } from '@ndla/i18n';

import { groupSearchQuery } from '../../../queries';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';
import { contentTypeMapping } from '../../../util/getContentType';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../constants';
import { toSearch } from '../../../routeHelpers';

const debounceCall = debounce(fun => fun(), 250);

const MastheadSearch = ({
  t,
  hideOnNarrowScreen,
  ndlaFilm,
  history,
  subject,
}) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedQuery] = useState('');
  const [subjects, setSubjects] = useState(subject ? subject.id : undefined);

  const [runSearch, { loading, data: searchResult = {}, error }] = useLazyQuery(
    groupSearchQuery,
  );

  useEffect(() => {
    setSubjects(subject?.id);
  }, [subject]);

  let closeModal;

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
          subjects,
          resourceTypes: [
            RESOURCE_TYPE_LEARNING_PATH,
            RESOURCE_TYPE_SUBJECT_MATERIAL,
            RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
          ].join(),
        },
        fetchPolicy: 'no-cache',
      });
    }
  }, [delayedSearchQuery]);

  const onFilterRemove = () => {
    setSubjects(undefined);
  };

  const onQueryChange = evt => {
    const query = evt;
    setQuery(query);
    debounceCall(() => setDelayedQuery(query));
  };

  const onClearQuery = () => {
    setQuery('');
  };

  const onSearch = evt => {
    evt.preventDefault();

    history.push({
      pathname: '/search',
      search: `?${queryString.stringify({
        query: query.length > 0 ? query : undefined,
        subjects,
      })}`,
    });
  };

  const onNavigate = () => {
    setQuery('');
    if (closeModal) {
      closeModal();
    }
  };

  const mapResults = (results = []) =>
    query.length > 1
      ? results.map(result => {
          const contentType = contentTypeMapping[result.resourceType];
          return {
            ...result,
            resources: result.resources.map(resource => ({
              ...resource,
              resourceType: result.resourceType, // TODO: return resourceType from grahql-api
            })),
            contentType,
            title: t(`contentTypes.${contentType}`),
          };
        })
      : [];

  const searchString = queryString.stringify({
    query: query && query.length > 0 ? query : undefined,
    subjects,
  });

  const filters = subjects ? [{ title: subject.name, value: subject.id }] : [];

  return (
    <MastheadSearchModal
      onClose={onClearQuery}
      hideOnNarrowScreen={hideOnNarrowScreen}
      ndlaFilm={ndlaFilm}>
      {error ||
        (onCloseModal => {
          closeModal = onCloseModal;
          return (
            <SearchFieldForm onSubmit={onSearch}>
              <SearchField
                placeholder={t('searchPage.searchFieldPlaceholder')}
                value={query}
                inputRef={inputRef}
                onChange={onQueryChange}
                filters={filters}
                onFilterRemove={onFilterRemove}
                messages={{
                  searchFieldTitle: t('searchPage.search'),
                }}
                loading={loading}
              />
              {query.length > 2 && (
                <SearchResultSleeve
                  result={mapResults(searchResult.groupSearch)}
                  searchString={query}
                  allResultUrl={toSearch(searchString)}
                  resourceToLinkProps={searchResultToLinkProps}
                  history={history}
                  onNavigate={onNavigate}
                />
              )}
            </SearchFieldForm>
          );
        })}
    </MastheadSearchModal>
  );
};

MastheadSearch.propTypes = {
  subject: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  hideOnNarrowScreen: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string,
  ndlaFilm: PropTypes.bool,
};

MastheadSearch.defaultProps = {
  hideOnNarrowScreen: false,
};

export default injectT(withRouter(MastheadSearch));
