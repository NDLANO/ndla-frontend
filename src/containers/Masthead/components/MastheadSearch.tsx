/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import debounce from 'lodash/debounce';
import queryString from 'query-string';
import { useState, useRef, useEffect, FormEvent } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Cross } from '@ndla/icons/action';
import { Search } from '@ndla/icons/common';
import { Drawer, Modal, ModalTrigger } from '@ndla/modal';
import { SearchField, SearchResultSleeve, SearchFieldForm } from '@ndla/ui';
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from '../../../constants';
import {
  GQLGroupSearchQuery,
  GQLGroupSearchQueryVariables,
  GQLMastheadSearch_SubjectFragment,
} from '../../../graphqlTypes';
import { groupSearchQuery } from '../../../queries';
import { toSearch, useIsNdlaFilm } from '../../../routeHelpers';
import { contentTypeMapping } from '../../../util/getContentType';
import { searchResultToLinkProps } from '../../SearchPage/searchHelpers';

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

  ${mq.range({ until: breakpoints.mobileWide })} {
    border-radius: 100%;
    background: transparent;
    border-color: transparent;
    padding: ${spacing.xsmall};
    span {
      display: none;
    }
  }
`;

const StyledCloseButton = styled(IconButtonV2)`
  margin-top: ${spacing.xsmall};
`;

const SearchWrapper = styled.div`
  width: 100%;
  padding: ${spacing.normal} ${spacing.normal};
  display: flex;
  align-items: flex-start;
  gap: ${spacing.xsmall};
  ${mq.range({ from: breakpoints.wide })} {
    width: 80%;
  }
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

  useEffect(() => {
    const onSlashPressed = (evt: KeyboardEvent) => {
      if (
        evt.key === '/' &&
        !['input', 'textarea'].includes(
          document.activeElement?.tagName.toLowerCase() ?? '',
        ) &&
        document.activeElement?.attributes.getNamedItem('contenteditable')
          ?.value !== 'true' &&
        !isOpen
      ) {
        evt.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', onSlashPressed);
    return () => window.removeEventListener('keydown', onSlashPressed);
  }, [isOpen]);

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
          aria-label={t('masthead.menu.search')}
          title={t('masthead.menu.search')}
          fontWeight="normal"
        >
          <span>{t('masthead.menu.search')}</span>
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
