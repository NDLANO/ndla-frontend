/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { Heading, Text } from '@ndla/typography';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../../components/AuthenticationContext';
import { useArenaCategories } from '../arenaQueries';
import ArenaCard from './components/ArenaCard';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const StyledCardContainer = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  padding: ${spacing.normal} 0;
`;

const ArenaCardWrapper = styled.li`
  list-style: none;
  margin: 0;
`;

const ArenaPage = () => {
  const { t } = useTranslation();
  const { loading, arenaCategories } = useArenaCategories();
  const { user } = useContext(AuthContext);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
  }

  return (
    <MyNdlaPageWrapper>
      <Heading element="h1" headingStyle="h1-resource" margin="small">
        {t('myNdla.arena.title')}
      </Heading>
      <Text element="p" textStyle="content-alt">
        {t('myNdla.arena.notification.description')}
      </Text>
      <Heading element="h2" headingStyle="h2" margin="large">
        {t('myNdla.arena.category.title')}
      </Heading>
      {loading ? (
        <Spinner />
      ) : (
        <StyledCardContainer>
          {arenaCategories?.map((category) => (
            <ArenaCardWrapper key={`topic-${category.id}`}>
              <ArenaCard
                id={category.id.toString()}
                title={category.name}
                subText={category.description}
                count={category.postCount}
              />
            </ArenaCardWrapper>
          ))}
        </StyledCardContainer>
      )}
      <Text element="p" textStyle="meta-text-small" margin="none">
        {t('myNdla.arena.bottomText')}
      </Text>
    </MyNdlaPageWrapper>
  );
};

export default ArenaPage;
