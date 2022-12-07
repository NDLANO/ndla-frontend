/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { HelmetWithTracker } from '@ndla/tracker';
import { OneColumn, ErrorMessage, ContentPlaceholder } from '@ndla/ui';
import { groupBy } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSubjects } from '../MyNdla/subjectMutations';
import { Status } from './interfaces';
import LetterNavigation from './LetterNavigation';
import StatusFilter from './StatusFilter';
import SubjectCategory from './SubjectCategory';

const StyledColumn = styled(OneColumn)`
  display: flex;
  flex-direction: column;
`;

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const { error, loading, subjects } = useSubjects();
  const [filter, setFilter] = useState<Status>('all');

  const groupedSubjects = Object.entries(
    groupBy(subjects, subject => {
      const firstChar = subject.name[0]?.toUpperCase();
      const isLetter = firstChar?.match(/[A-Z\WÆØÅ]+/);
      return isLetter ? firstChar : '#';
    }),
  ).sort((a, b) => (a[0] > b[0] ? 1 : -1));

  const letters = groupedSubjects.map(group => group[0]);

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
      <StyledColumn>
        <h1>{t('subjectsPage.chooseSubject')}</h1>
        <StatusFilter value={filter} onChange={setFilter} />
        <LetterNavigation activeLetters={letters} />
        {groupedSubjects.map(([key, value]) => (
          <SubjectCategory key={key} label={key} subjects={value} />
        ))}
      </StyledColumn>
    </div>
  );
};

export default AllSubjectsPage;
