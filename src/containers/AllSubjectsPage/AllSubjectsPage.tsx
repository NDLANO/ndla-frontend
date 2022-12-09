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
import { sortBy } from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import LoginModal from '../../components/MyNdla/LoginModal';

import { useSubjects } from '../MyNdla/subjectMutations';
import { usePersonalData } from '../MyNdla/userMutations';
import FavoriteSubjects from './FavoriteSubjects';
import { Status } from './interfaces';
import LetterNavigation from './LetterNavigation';
import StatusFilter from './StatusFilter';
import SubjectCategory from './SubjectCategory';
import { filterSubjects, groupSubjects } from './utils';

const StyledColumn = styled(OneColumn)`
  display: flex;
  flex-direction: column;
`;

const AllSubjectsPage = () => {
  const { t } = useTranslation();
  const { error, loading, subjects } = useSubjects();
  const [filter, setFilter] = useState<Status>('all');
  const { authenticated } = useContext(AuthContext);
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      <StyledColumn>
        <h1>{t('subjectsPage.allSubjects')}</h1>
        {!!favoriteSubjects?.length && (
          <FavoriteSubjects
            favorites={favoriteSubjects}
            subjects={sortedSubjects}
          />
        )}
        <StatusFilter value={filter} onChange={setFilter} />
        <LetterNavigation activeLetters={letters} />
        {groupedSubjects.map(({ label, subjects }) => (
          <SubjectCategory
            favorites={favoriteSubjects}
            key={label}
            label={label}
            subjects={subjects}
            openLoginModal={() => setShowLoginModal(true)}
          />
        ))}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </StyledColumn>
    </div>
  );
};

export default AllSubjectsPage;
