import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SearchField, SearchResultSleeve, SearchFieldForm } from '@ndla/ui';
import queryString from 'query-string';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { injectT } from '@ndla/i18n';
import { groupSearchQuery } from '../../../queries';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';
import { contentTypeMapping } from '../../../util/getContentType';
import MastheadSearchModal from './MastheadSearchModal';
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
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedQuery] = useState('');
  const [subjects, setSubjects] = useState(subject ? subject.id : undefined);

  const inputRef = useRef(null);

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

  const searchParams = {
    query: delayedSearchQuery,
    subjects,
    resourceTypes: [
      RESOURCE_TYPE_LEARNING_PATH,
      RESOURCE_TYPE_SUBJECT_MATERIAL,
      RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
    ].join(),
  };
  const filters = subjects ? [{ title: subject.name, value: subject.id }] : [];

  return (
    <MastheadSearchModal
      onSearchExit={onClearQuery}
      hideOnNarrowScreen={hideOnNarrowScreen}
      inputRef={inputRef}
      ndlaFilm={ndlaFilm}>
      <Query
        fetchPolicy="no-cache"
        variables={searchParams}
        ssr={false}
        query={groupSearchQuery}>
        {({ data, error }) =>
          error || (
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
              />
              {query.length > 2 && (
                <SearchResultSleeve
                  result={mapResults(data.groupSearch)}
                  searchString={query}
                  allResultUrl={toSearch(searchString)}
                  resourceToLinkProps={searchResultToLinkProps}
                />
              )}
            </SearchFieldForm>
          )
        }
      </Query>
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
