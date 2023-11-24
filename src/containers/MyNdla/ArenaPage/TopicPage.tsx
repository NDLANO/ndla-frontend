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
import { spacing } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import { ButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { useParams } from 'react-router-dom';
import { useArenaCategory } from '../arenaQueries';
import ArenaCard from '../ArenaCards/ArenaCard';
import { GQLArenaTopicFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';

const BreadcrumbWrapper = styled.div`
  margin-top: ${spacing.normal};
`;

const StyledTopicHeader = styled(Heading)`
  margin-bottom: ${spacing.small};
`;

const TopicDescription = styled(Text)`
  width: 700px;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledTopicH2 = styled(Heading)`
  align-self: center;
`;

const StyledNewTopicButton = styled(ButtonV2)`
  height: 42px;
  gap: ${spacing.xsmall};
  white-space: nowrap;
`;

const StyledPencilIcon = styled(Icon)`
  width: ${spacing.snormal};
  height: ${spacing.snormal};
`;

const PencilIcon = StyledPencilIcon.withComponent(Pencil);

const StyledCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: ${spacing.small} 0;
`;

const TopicPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { loading, arenaCategory } = useArenaCategory(Number(categoryId), 1);

  if (loading) {
    return <Spinner />;
  }

  return (
    <MyNdlaPageWrapper>
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={
            categoryId
              ? [{ name: arenaCategory?.name ?? '', id: categoryId }]
              : []
          }
          page={'arena'}
        />
      </BreadcrumbWrapper>
      <StyledTopicHeader element="h1" headingStyle="h1-resource">
        {arenaCategory?.name}
      </StyledTopicHeader>
      <TopicDescription element="p" textStyle="content-alt" margin="none">
        {arenaCategory?.description}
      </TopicDescription>
      <StyledContainer>
        <StyledTopicH2 element="h2" headingStyle="h2" margin="none">
          {t('myNdla.arena.category.posts')}
        </StyledTopicH2>
        <StyledNewTopicButton
          colorTheme="lighter"
          //onClick={} to open modal
        >
          {t('myNdla.arena.category.newPost')}
          <PencilIcon />
        </StyledNewTopicButton>
      </StyledContainer>
      {arenaCategory?.topics?.map((topic: GQLArenaTopicFragmentFragment) => (
        <StyledCardContainer key={`topicContainer-${topic.id}`}>
          <ArenaCard
            key={`topic-${topic.id}`}
            id={topic.id.toString()}
            cardType="ArenaTopic"
            title={topic.title}
            timestamp={topic.timestamp}
            count={topic.postCount}
            categoryId={categoryId}
          />
        </StyledCardContainer>
      ))}
    </MyNdlaPageWrapper>
  );
};

export default TopicPage;
