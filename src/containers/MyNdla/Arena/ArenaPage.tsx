/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { SafeLinkButton } from '@ndla/safelink';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { Heading, Text } from '@ndla/typography';
import SortableArenaCards from './components/SortableArenaCards';
import { useArenaCategories } from './components/temporaryNodebbHooks';
import { AuthContext } from '../../../components/AuthenticationContext';
import { SKIP_TO_CONTENT_ID } from '../../../constants';
import { getAllDimensions } from '../../../util/trackingUtil';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const ModeratorButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${spacing.xsmall};
`;

const ArenaPage = () => {
  const { t } = useTranslation();
  const { loading, arenaCategories } = useArenaCategories();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled) return;
    trackPageView({
      title: t('htmlTitles.arenaPage'),
      dimensions: getAllDimensions({ user }),
    });
  }, [authContextLoaded, t, trackPageView, user]);

  if (loading || !authContextLoaded) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled) return <Navigate to="/minndla" />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t('htmlTitles.arenaPage')} />
      <Heading
        element="h1"
        id={SKIP_TO_CONTENT_ID}
        headingStyle="h1-resource"
        margin="small"
      >
        {t('myNdla.arena.title')}
      </Heading>
      <Text element="p" textStyle="content-alt" margin="none">
        {parse(t('myNdla.arena.notification.description'))}
      </Text>
      <StyledContainer>
        <Heading element="h2" headingStyle="h2" margin="none">
          {t('myNdla.arena.category.title')}
        </Heading>
        {user.isModerator && (
          <ModeratorButtonWrapper>
            <ButtonV2 onClick={() => setIsEditing((prev) => !prev)}>
              {isEditing
                ? t('myNdla.arena.admin.category.stopEditing')
                : t('myNdla.arena.admin.category.startEditing')}
            </ButtonV2>
            <SafeLinkButton to="category/new">
              {t('myNdla.arena.admin.category.form.newCategory')}
            </SafeLinkButton>
          </ModeratorButtonWrapper>
        )}
      </StyledContainer>
      {loading ? (
        <Spinner />
      ) : (
        <SortableArenaCards
          isEditing={isEditing}
          categories={arenaCategories ?? []}
          user={user}
        />
      )}
      <Text element="p" textStyle="meta-text-small" margin="none">
        {t('myNdla.arena.bottomText')}
      </Text>
    </MyNdlaPageWrapper>
  );
};

export default ArenaPage;
