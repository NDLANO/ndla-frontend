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
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { SafeLinkButton } from '@ndla/safelink';
import { MenuBook } from '@ndla/icons/action';
import { AuthContext } from '../../../components/AuthenticationContext';
import SubjectLink from '../../AllSubjectsPage/SubjectLink';
import { useSubjects } from '../subjectQueries';
import { usePersonalData } from '../userMutations';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import { getAllDimensions } from '../../../util/trackingUtil';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  width: 100%;
  ${mq.range({ from: breakpoints.desktop })} {
    align-items: flex-start;
    width: auto;
  }
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.small};
  margin-top: ${spacing.normal};
`;

const StyledUl = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;
`;

const FavoriteSubjectsPage = () => {
  const { t } = useTranslation();
  const { loading, subjects } = useSubjects();
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  const { authenticated, user } = useContext(AuthContext);
  const { trackPageView } = useTracker();

  const favoriteSubjects = useMemo(() => {
    if (loading || !subjects || !personalData?.favoriteSubjects) return [];
    return subjects.filter((s) => personalData.favoriteSubjects.includes(s.id));
  }, [loading, personalData?.favoriteSubjects, subjects]);

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  useEffect(() => {
    trackPageView({
      title: t('myNdla.favoriteSubjects.title'),
      dimensions: getAllDimensions({ user }),
    });
  }, [t, trackPageView, user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Wrapper>
      <HelmetWithTracker title={t('myNdla.favoriteSubjects.title')} />
      <MyNdlaBreadcrumb
        page="subjects"
        breadcrumbs={[]}
        backCrumb={'minndla'}
      />
      <MyNdlaTitle title={t('myNdla.favoriteSubjects.title')} />
      <Container>
        <CountContainer>
          <MenuBook />
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
        <StyledUl>
          {favoriteSubjects.map((subject) => (
            <StyledSubjectLink
              key={subject.id}
              favorites={personalData?.favoriteSubjects}
              subject={subject}
            />
          ))}
        </StyledUl>
      )}
    </Wrapper>
  );
};

export default FavoriteSubjectsPage;
