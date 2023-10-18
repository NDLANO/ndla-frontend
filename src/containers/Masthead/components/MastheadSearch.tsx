import { useState, useRef, useEffect, FormEvent } from 'react';
import { SearchField, SearchResultSleeve, SearchFieldForm } from '@ndla/ui';
import queryString from 'query-string';
import { gql, useLazyQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

import { useTranslation } from 'react-i18next';
import { Drawer, Modal, ModalTrigger } from '@ndla/modal';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Search } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
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
  subject?: GQLMastheadSearch_SubjectFragment;
}

const StyledButton = styled(ButtonV2)`
  padding: ${spacing.small} ${spacing.normal};
  gap: ${spacing.medium};
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StyledCloseButton = styled(IconButtonV2)`
  margin-top: ${spacing.xsmall};
`;

const SearchWrapper = styled.div`
  width: 60%;
  padding: ${spacing.normal} 0px;
  display: flex;
  align-items: flex-start;
  gap: ${spacing.xsmall};
`;

const StyledDrawer = styled(Drawer)`
  background-color: ${colors.brand.greyLightest};
  display: flex;
  justify-content: center;
`;

const MastheadSearch = ({ subject }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ndlaFilm = useIsNdlaFilm();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [delayedSearchQuery, setDelayedQuery] = useState('');
  const [subjects, setSubjects] = useState(subject ? subject.id : undefined);

  useEffect(() => {
    setQuery('');
  }, [pathname]);

  const [runSearch, { loading, data: searchResult = {}, error }] = useLazyQuery<
    GQLGroupSearchQuery,
    GQLGroupSearchQueryVariables
  >(groupSearchQuery, { fetchPolicy: 'no-cache' });

  useEffect(() => {
    setSubjects(subject?.id);
  }, [subject]);

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

  const onNavigate = () => {
    setIsOpen(false);
    setQuery('');
  };

  type MapResultsType = Pick<
    Required<GQLGroupSearchQuery>['groupSearch'][0],
    'resourceType' | 'resources'
  >;

  const mapResults = (results: MapResultsType[] = []) =>
    query.length > 1
      ? results.map((result) => {
          const contentType = contentTypeMapping[result.resourceType];
          return {
            ...result,
            resources: result.resources.map((resource) => ({
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
    setIsOpen(false);
  };

  const filters =
    subjects && subject ? [{ title: subject.name, value: subject.id }] : [];

  return (
    <Modal open={isOpen} onOpenChange={setIsOpen}>
      <ModalTrigger>
        <StyledButton
          colorTheme={ndlaFilm ? 'primary' : 'greyLighter'}
          fontWeight="normal"
        >
          {t('masthead.menu.search')}
          <Search />
        </StyledButton>
      </ModalTrigger>
      <StyledDrawer
        aria-label={t('searchPage.searchFieldPlaceholder')}
        position="top"
        expands
        size="small"
        animationDuration={200}
      >
        <SearchWrapper>
          {!error ? (
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
          ) : null}
          <StyledCloseButton
            aria-label={t('close')}
            title={t('close')}
            variant="ghost"
            colorTheme="light"
            onClick={() => setIsOpen(false)}
          >
            <Cross />
          </StyledCloseButton>
        </SearchWrapper>
      </StyledDrawer>
    </Modal>
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
