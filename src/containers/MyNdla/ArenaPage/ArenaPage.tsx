/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing, fonts } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { Heading, Text } from '@ndla/typography';
import { AuthContext } from '../../../components/AuthenticationContext';
import { useArenaCategories } from '../arenaQueries';
import { usePersonalData } from '../userMutations';
import ArenaCard from '../ArenaCards/ArenaCard';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const StyledArenaHeader = styled(Heading)`
  margin-bottom: ${spacing.small};
`;

const ArenaDescription = styled(Text)`
  width: 700px;
  margin-top: 0px;
  margin-bottom: ${spacing.large};
`;

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: ${spacing.normal} 0;
`;

const StyledBottomText = styled.div`
  ${fonts.sizes('16px', '26px')};
  font-weight: ${fonts.weight.normal};
  margin-top: ${spacing.small};
`;

const ArenaPage = () => {
  const { t } = useTranslation();
  const { loading, arenaCategories } = useArenaCategories();
  const { authenticated } = useContext(AuthContext);
  const { personalData, fetch: fetchPersonalData } = usePersonalData();
  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  if (loading) {
    return <Spinner />;
  }
  if (!personalData?.arenaEnabled) {
    // Should redirect to /myndla?
    return null;
  }
  return (
    <MyNdlaPageWrapper>
      <StyledArenaHeader element="h1" headingStyle="h1-resource">
        {t('myNdla.arena.title')}
      </StyledArenaHeader>
      <ArenaDescription element="p" textStyle="content-alt">
        {t('myNdla.arena.notification.description')}
      </ArenaDescription>
      <Heading element="h2" headingStyle="h2" margin="none">
        {t('myNdla.arena.category.title')}
      </Heading>
      {loading ? (
        <Spinner />
      ) : (
        <StyledCardContainer>
          {arenaCategories?.map((category) => (
            <ArenaCard
              key={`topic-${category.id}`}
              id={category.id.toString()}
              title={category.name}
              subText={category.description}
              count={category.postCount}
            />
          ))}
        </StyledCardContainer>
      )}
      <StyledBottomText>{t('myNdla.arena.bottomText')}</StyledBottomText>
    </MyNdlaPageWrapper>
  );
};

export default ArenaPage;
