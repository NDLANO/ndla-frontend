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
import { spacing } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import { Navigate, useParams } from 'react-router-dom';
import { useCallback, useContext, useEffect } from 'react';
import { useArenaCategory, useCreateArenaTopic } from '../arenaQueries';
import TopicCard from './components/TopicCard';
import { GQLArenaTopicFragmentFragment } from '../../../graphqlTypes';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import { usePersonalData } from '../userMutations';
import { AuthContext } from '../../../components/AuthenticationContext';
import ArenaTextModal from './components/ArenaTextModal';
import { ArenaFormValues } from './components/ArenaForm';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

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
  const { createArenaTopic } = useCreateArenaTopic(Number(categoryId));

  useEffect(() => {
    if (authenticated) {
      fetchPersonalData();
    }
  }, [authenticated, fetchPersonalData]);

  const createTopic = useCallback(
    async (data: ArenaFormValues) => {
      await createArenaTopic({
        variables: { ...data, categoryId: arenaCategory?.id },
      });
    },
    [arenaCategory?.id, createArenaTopic],
  );

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
        <ArenaTextModal
          type={'topic'}
          siblingTopics={arenaCategory?.topics}
          onSave={createTopic}
        />
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
