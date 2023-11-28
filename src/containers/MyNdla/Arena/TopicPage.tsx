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
import { Navigate, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useArenaCategory } from '../arenaQueries';
import TopicCard from './components/TopicCard';
import { GQLArenaTopicFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import { usePersonalData } from '../userMutations';
import { AuthContext } from '../../../components/AuthenticationContext';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledNewTopicButton = styled(ButtonV2)`
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

  if (!personalData?.arenaEnabled && personalData?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
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
      <Heading element="h1" headingStyle="h1-resource" margin="small">
        {arenaCategory?.name}
      </Heading>
      <Text element="p" textStyle="content-alt" margin="none">
        {arenaCategory?.description}
      </Text>
      <StyledContainer>
        <Heading element="h2" headingStyle="h2" margin="none">
          {t('myNdla.arena.category.posts')}
        </Heading>
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
          <TopicCard
            key={`topic-${topic.id}`}
            id={topic.id.toString()}
            title={topic.title}
            timestamp={topic.timestamp}
            count={topic.postCount}
          />
        </StyledCardContainer>
      ))}
    </MyNdlaPageWrapper>
  );
};

export default TopicPage;
