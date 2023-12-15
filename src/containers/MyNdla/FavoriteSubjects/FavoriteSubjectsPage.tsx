/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { Forward } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { AuthContext } from '../../../components/AuthenticationContext';
import { getAllDimensions } from '../../../util/trackingUtil';
import SubjectLink from '../../AllSubjectsPage/SubjectLink';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaTitle from '../components/MyNdlaTitle';
import SettingsMenu from '../components/SettingsMenu';
import { tbButtonCss } from '../components/toolbarStyles';
import { iconCss } from '../Folders/FoldersPage';
import { useSubjects } from '../subjectQueries';

const StyledSubjectLink = styled(SubjectLink)`
  border: 1px solid ${colors.brand.neutral7};
  padding: ${spacing.small};
  border-radius: 2px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.large};
  margin-top: ${spacing.normal};
`;

const StyledUl = styled.ul`
  padding: 0;
  margin: 0;
  width: 100%;
`;

const StyledListItem = styled.li`
  margin: 0;
`;

const FavoriteSubjectsPage = () => {
  const { t } = useTranslation();
  const { loading, subjects } = useSubjects();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const navigate = useNavigate();

  const favoriteSubjects = useMemo(() => {
    if (loading || !subjects || !user?.favoriteSubjects) return [];
    return subjects.filter((s) => user.favoriteSubjects.includes(s.id));
  }, [loading, user?.favoriteSubjects, subjects]);

  useEffect(() => {
    if (!authContextLoaded) return;
    trackPageView({
      title: t('myNdla.favoriteSubjects.title'),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  const allSubjects = useMemo(
    () => (
      <StyledListItem>
        <SafeLinkButton
          css={tbButtonCss}
          variant="ghost"
          colorTheme="lighter"
          to="/subjects"
        >
          {t('subjectsPage.allSubjects')}
          <Forward css={iconCss} />
        </SafeLinkButton>
      </StyledListItem>
    ),
    [t],
  );

  const dropDown = useMemo(
    () => (
      <SettingsMenu
        menuItems={[
          {
            text: t('subjectsPage.allSubjects'),
            icon: <Forward css={iconCss} />,
            onClick: () => navigate('/subjects'),
          },
        ]}
        modalHeader={t('myNdla.tools')}
      />
    ),
    [t, navigate],
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper buttons={allSubjects} dropDownMenu={dropDown}>
      <Wrapper>
        <HelmetWithTracker title={t('myNdla.favoriteSubjects.title')} />
        <MyNdlaTitle title={t('myNdla.favoriteSubjects.title')} />
        {loading ? (
          <Spinner />
        ) : !favoriteSubjects?.length ? (
          <p>{t('myNdla.favoriteSubjects.noFavorites')}</p>
        ) : (
          <StyledUl>
            {favoriteSubjects.map((subject) => (
              <StyledSubjectLink
                key={subject.id}
                favorites={user?.favoriteSubjects}
                subject={subject}
              />
            ))}
          </StyledUl>
        )}
      </Wrapper>
    </MyNdlaPageWrapper>
  );
};

export default FavoriteSubjectsPage;
