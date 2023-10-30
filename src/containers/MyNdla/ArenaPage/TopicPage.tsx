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
import { Heading } from '@ndla/typography';
import { useTopics } from '../arenaMutations';
import ArenaCard from '../ArenaCards/ArenaCard';

const StyledTopicHeader = styled(Heading)`
  ${fonts.sizes('38px', '48px')};
  margin-bottom: ${spacing.small};
`;

const TopicDescription = styled.div`
  width: 700px;
  ${fonts.sizes('18px', '29px')};
  font-weight: ${fonts.weight.normal};
`;

const StyledTopicH2 = styled.h2`
  ${fonts.sizes('22px', '33px')};
`;

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: ${spacing.small} 0;
`;

const TopicPage = () => {
  const { t } = useTranslation();
  const { error, loading, arenaTopics } = useTopics();

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <StyledTopicHeader element="h1" headingStyle="default">
        {'test'}
      </StyledTopicHeader>
      <TopicDescription>{'test description to be replaced'}</TopicDescription>
      <StyledTopicH2>{'Innlegg'}</StyledTopicH2>
      {loading ? (
        <Spinner />
      ) : (
        <StyledCardContainer>
          <ArenaCard
            key={1}
            id={'1'}
            cardType="ArenaTopic"
            title={'test'}
            subText={'Blalalalalalal'}
            count={20}
          />
        </StyledCardContainer>
      )}
    </>
  );
};

export default TopicPage;
