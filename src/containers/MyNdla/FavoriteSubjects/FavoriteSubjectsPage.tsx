/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import { useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { HelmetWithTracker } from '@ndla/tracker';
import { SafeLinkButton } from '@ndla/safelink';
import { BookOpen } from '@ndla/icons/common';
import { AuthContext } from '../../../components/AuthenticationContext';
import SubjectLink from '../../AllSubjectsPage/SubjectLink';
import { useSubjects } from '../subjectQueries';
import { usePersonalData } from '../userMutations';
import { SKIP_TO_CONTENT_ID } from '../../../constants';

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: ${spacing.small};
`;

const CountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
`;

const StyledSubjectLink = styled(SubjectLink)`
  border: 1px solid ${colors.brand.neutral7};
  padding: ${spacing.small};
  border-radius: 2px;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  flex-grow: 1;
`;

const FavoriteSubjectsPage = () => {
  const { t } = useTranslation();
  const { loading, subjects } = useSubjects();
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const { authenticated } = useContext(AuthContext);

  const favoriteSubjects = useMemo(() => {
    if (loading || !subjects || !personalData?.favoriteSubjects) return [];
    return subjects.filter(s => personalData.favoriteSubjects.includes(s.id));
  }, [loading, personalData?.favoriteSubjects, subjects]);

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <HelmetWithTracker title={t('myNdla.favoriteSubjects.title')} />
      <h1 id={SKIP_TO_CONTENT_ID}>{t('myNdla.favoriteSubjects.title')}</h1>
      <Container>
        <CountContainer>
          <BookOpen />
          {t('myNdla.favoriteSubjects.subjects', {
            count: favoriteSubjects.length,
          })}
        </CountContainer>

        <StyledSafeLinkButton
          size="normal"
          to="/subjects"
          colorTheme="light"
          shape="pill"
        >
          {t('myNdla.favoriteSubjects.goToAllSubjects')}
        </StyledSafeLinkButton>
      </Container>
      {loading ? (
        <Spinner />
      ) : !favoriteSubjects?.length ? (
        <p>{t('myNdla.favoriteSubjects.noFavorites')}</p>
      ) : (
        <ul>
          {favoriteSubjects.map(subject => (
            <StyledSubjectLink
              key={subject.id}
              favorites={personalData?.favoriteSubjects}
              subject={subject}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export default FavoriteSubjectsPage;
