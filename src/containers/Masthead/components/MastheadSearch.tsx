import { useState, useRef, useEffect, FormEvent } from 'react';
import {
  SearchField,
  SearchResultSleeve,
  SearchFieldForm,
  MastheadSearchModal,
} from '@ndla/ui';
import queryString from 'query-string';
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { useTranslation } from 'react-i18next';
import { groupSearchQuery } from '../../../queries';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';
import { contentTypeMapping } from '../../../util/getContentType';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../constants';
import { toSearch, useIsNdlaFilm } from '../../../routeHelpers';
import {
  GQLGroupSearchQuery,
  GQLGroupSearchQueryVariables,
  GQLMastheadSearch_SubjectFragment,
} from '../../../graphqlTypes';

const debounceCall = debounce((fun: (func?: Function) => void) => fun(), 250);

interface Props {
  hideOnNarrowScreen?: boolean;
  subject?: GQLMastheadSearch_SubjectFragment;
}

const MastheadSearch = ({ hideOnNarrowScreen = false, subject }: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedQuery] = useState('');
  const [subjects, setSubjects] = useState(subject ? subject.id : undefined);

  const [runSearch, { loading, data: searchResult = {}, error }] = useLazyQuery<
    GQLGroupSearchQuery,
    GQLGroupSearchQueryVariables
  >(groupSearchQuery, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    setSubjects(subject?.id);
  }, [subject]);

  let closeModal: () => void | undefined;

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
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const onFilterRemove = () => {
    setSubjects(undefined);
  };

  const onQueryChange = (evt: string) => {
    const query = evt;
    setQuery(query);
    debounceCall(() => setDelayedQuery(query));
  };

  const onClearQuery = () => {
    setQuery('');
  };

  const onNavigate = () => {
    setQuery('');
    if (closeModal) {
      closeModal();
    }
  };

  type MapResultsType = Pick<
    Required<GQLGroupSearchQuery>['groupSearch'][0],
    'resourceType' | 'resources'
  >;

  const mapResults = (results: MapResultsType[] = []) =>
    query.length > 1
      ? results.map(result => {
          const contentType = contentTypeMapping[result.resourceType];
          return {
            ...result,
            resources: result.resources.map(resource => ({
              ...resource,
              id: resource.id.toString(),
              resourceType: result.resourceType,
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

  const onSearch = (evt: FormEvent) => {
    evt.preventDefault();

    navigate({ pathname: '/search', search: `?${searchString}` });
  };

  const filters =
    subjects && subject ? [{ title: subject.name, value: subject.id }] : [];

  return (
    <MastheadSearchModal
      onClose={onClearQuery}
      hideOnNarrowScreen={hideOnNarrowScreen}
      ndlaFilm={ndlaFilm}
    >
      {(onCloseModal: Function) => {
        closeModal = onCloseModal as () => void;
        return (
          error || (
            <SearchFieldForm onSubmit={onSearch}>
              <SearchField
                placeholder={t('searchPage.searchFieldPlaceholder')}
                value={query}
                inputRef={inputRef}
                onChange={onQueryChange}
                filters={filters}
                onFilterRemove={onFilterRemove}
                loading={loading}
              />
              {query.length > 2 && (
                <SearchResultSleeve
                  result={mapResults(searchResult.groupSearch)}
                  searchString={query}
                  allResultUrl={toSearch(searchString)}
                  resourceToLinkProps={searchResultToLinkProps}
                  onNavigate={onNavigate}
                  loading={loading}
                />
              )}
            </SearchFieldForm>
          )
        );
      }}
    </MastheadSearchModal>
  );
};

MastheadSearch.fragments = {
  subject: gql`
    fragment MastheadSearch_Subject on Subject {
      id
      name
    }
  `,
};

export default MastheadSearch;
