/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Icon, { Spinner } from '@ndla/icons';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { spacing, fonts } from '@ndla/core';
import { Heading } from '@ndla/typography';
import { ButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { useTopics } from '../arenaMutations';
import ArenaCard from '../ArenaCards/ArenaCard';
import PostCard from '../ArenaCards/PostCard';

const StyledTopicHeader = styled(Heading)`
  ${fonts.sizes('38px', '48px')};
  margin-bottom: ${spacing.small};
`;

const TopicDescription = styled.div`
  width: 700px;
  ${fonts.sizes('18px', '29px')};
  font-weight: ${fonts.weight.normal};
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledTopicH2 = styled.h2`
  ${fonts.sizes('22px', '33px')};
  margin: 0;
  align-self: center;
`;

const StyledNewTopicButton = styled(ButtonV2)`
  height: 42px;
  gap: 8px;
  white-space: nowrap;
`;

const StyledPencilIcon = styled(Icon)`
  width: 20px;
  height: 20px;
`;

const PencilIcon = StyledPencilIcon.withComponent(Pencil);

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: ${spacing.small} 0;
`;

const TopicPage = () => {
  const { t } = useTranslation();
  const { loading, arenaTopics } = useTopics();

  console.log(arenaTopics);

  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <StyledTopicHeader element="h1" headingStyle="default">
        {'test'}
      </StyledTopicHeader>
      <TopicDescription>{'test description to be replaced'}</TopicDescription>
      <StyledContainer>
        <StyledTopicH2>{t('arena.category.posts')}</StyledTopicH2>
        <StyledNewTopicButton
          colorTheme="lighter"
          //onClick={} to open modal
        >
          {t('arena.category.newPost')}
          <PencilIcon />
        </StyledNewTopicButton>
      </StyledContainer>
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
            timestamp={'30.10.2024'}
            count={20}
          />
        </StyledCardContainer>
      )}
      <PostCard
        id={'1'}
        isMainPost={true}
        title={'Tittel på innlegget'}
        content={
          'Lorem ipsum dolor sit amet consectetur. Vitae ut maecenas commodo nisi cursus amet. Mattis a eu suspendisse massa. Vel ac risus nibh phasellus. Est proin in eget ligula at turpis lectus tristique. Ullamcorper praesent eget turpis convallis. Faucibus pellentesque pharetra posuere scelerisque. Ligula at neque tellus aenean. Vivamus posuere eu non ipsum. Ut tellus vivamus mi proin. Duis orci ullamcorper enim gravida nibh tristique adipiscing. Mi lobortis mauris sem tellus neque. Pellentesque montes ut in habitant viverra convallis ac.'
        }
        notify={true}
      />
    </>
  );
};

export default TopicPage;
