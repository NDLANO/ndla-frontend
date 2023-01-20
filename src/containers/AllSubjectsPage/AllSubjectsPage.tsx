/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { Select } from '@ndla/select';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  ErrorMessage,
  ContentPlaceholder,
  OneColumn,
  constants,
} from '@ndla/ui';
import { TFunction } from 'i18next';
import sortBy from 'lodash/sortBy';
import { parse, stringify } from 'query-string';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';
import TabFilter from '../../components/TabFilter';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import IsMobileContext from '../../IsMobileContext';

import { useSubjects } from '../MyNdla/subjectQueries';
import { usePersonalData } from '../MyNdla/userMutations';
import FavoriteSubjects from './FavoriteSubjects';
import LetterNavigation from './LetterNavigation';
import SubjectCategory from './SubjectCategory';
import { filterSubjects, groupSubjects } from './utils';

const {
  ACTIVE_SUBJECTS,
  ARCHIVE_SUBJECTS,
  BETA_SUBJECTS,
  OTHER,
} = constants.subjectCategories;

const createFilterTranslation = (t: TFunction, key: string, addTail = true) => {
  const label = addTail
    ? `${t(`subjectCategories.${key}`)} ${t('contentTypes.subject')}`
    : t(`subjectCategories.${key}`);
  return label.toLocaleUpperCase();
};

const createFilters = (t: TFunction) => [
  {
    label: createFilterTranslation(t, ACTIVE_SUBJECTS),
    value: ACTIVE_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, ARCHIVE_SUBJECTS),
    value: ARCHIVE_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, BETA_SUBJECTS),
    value: BETA_SUBJECTS,
  },
  {
    label: createFilterTranslation(t, OTHER, false),
    value: OTHER,
  },
  {
    label: `${t('contentTypes.all')} ${t(
      'contentTypes.subject',
    )}`.toUpperCase(),
    value: 'all',
  },
];

const StyledColumn = styled(OneColumn)`
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledHeading = styled.h1`
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes('48px', '60px')};
`;

const SelectWrapper = styled.div`
  padding: ${spacing.xsmall};
  border-radius: 12px;
  background: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.lighter};
  margin: ${spacing.normal} 0 ${spacing.small};
`;

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useContext(IsMobileContext);
  const location = useLocation();
  const { authenticated } = useContext(AuthContext);

  const { error, loading, subjects } = useSubjects();
  const { personalData, fetch: fetchPersonalData } = usePersonalData();

  const filterOptions = useMemo(() => createFilters(t), [t]);
  const [filter, _setFilter] = useState<string>(
    parse(location.search).filter || ACTIVE_SUBJECTS,
  );
  const setFilter = (value: string) => {
    const searchObject = parse(location.search);
    _setFilter(value);
    const search = stringify({
      ...searchObject,
      filter: value !== ACTIVE_SUBJECTS ? value : undefined,
    });
    navigate(`${location.pathname}?${search}`);
  };

  const favoriteSubjects = personalData?.favoriteSubjects;
  const sortedSubjects = useMemo(() => sortBy(subjects, s => s.name), [
    subjects,
  ]);
  const groupedSubjects = useMemo(() => {
    const filteredSubjects = filterSubjects(sortedSubjects, filter);
    return groupSubjects(filteredSubjects);
  }, [sortedSubjects, filter]);

  const letters = useMemo(() => groupedSubjects.map(group => group.label), [
    groupedSubjects,
  ]);

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  if (loading) return <ContentPlaceholder />;
  if (error)
    return (
      <ErrorMessage
        illustration={{
          url: '/static/oops.gif',
          altText: t('errorMessage.title'),
        }}
        messages={{
          title: t('errorMessage.title'),
          description: t('subjectsPage.errorDescription'),
          back: t('errorMessage.back'),
          goToFrontPage: t('errorMessage.goToFrontPage'),
        }}
      />
    );

  return (
    <div className="c-resources u-padding-top-large">
      <HelmetWithTracker title={t('htmlTitles.subjectsPage')} />
      <StyledColumn wide>
        <StyledHeading id={SKIP_TO_CONTENT_ID}>
          {t('subjectsPage.allSubjects')}
        </StyledHeading>
        {!!favoriteSubjects?.length && (
          <FavoriteSubjects
            favorites={favoriteSubjects}
            subjects={sortedSubjects}
          />
        )}
        {isMobile ? (
          <SelectWrapper>
            <Select<false>
              value={filterOptions.find(opt => opt.value === filter)}
              onChange={value => value && setFilter(value?.value)}
              options={filterOptions}
              colorTheme="white"
              outline
              bold
              prefix={`${t('subjectsPage.shows').toUpperCase()}: `}
            />
          </SelectWrapper>
        ) : (
          <TabFilter
            value={filter}
            onChange={setFilter}
            options={filterOptions}
          />
        )}
        <LetterNavigation activeLetters={letters} />
        <StyledList aria-label={t('subjectsPage.alphabeticSort')}>
          {groupedSubjects.map(({ label, subjects }) => (
            <SubjectCategory
              favorites={favoriteSubjects}
              key={label}
              label={label}
              subjects={subjects}
            />
          ))}
        </StyledList>
      </StyledColumn>
    </div>
  );
};

export default AllSubjectsPage;
