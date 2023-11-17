/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from '@ndla/icons';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { spacing, fonts } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import { useArenaCategories } from '../arenaMutations';
import ArenaCard from '../ArenaCards/ArenaCard';

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
  const { loading, data } = useArenaCategories();

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <StyledArenaHeader element="h1" headingStyle="h1-resource">
        {t('arena.header')}
      </StyledArenaHeader>
      <ArenaDescription element="p" textStyle="content-alt">
        {t('arena.description')}
      </ArenaDescription>
      <Heading element="h2" headingStyle="h2" margin="none">
        {t('arena.title')}
      </Heading>
      {loading ? (
        <Spinner />
      ) : (
        <StyledCardContainer>
          {data?.arenaCategories?.map((category) => (
            <ArenaCard
              key={`topic-${category.id}`}
              id={category.id.toString()}
              cardType="ArenaCategory"
              title={category.name}
              subText={category.description}
              count={category.postCount}
            />
          ))}
        </StyledCardContainer>
      )}
      <StyledBottomText>{t('arena.bottomText')}</StyledBottomText>
    </>
  );
};

export default ArenaPage;
