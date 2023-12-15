/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { Heading, Text } from '@ndla/typography';
import ArenaActions from './ArenaActions';
import ArenaButtons from './ArenaButtons';
import { ArenaFormValues } from './components/ArenaForm';
import ArenaTextModal from './components/ArenaTextModal';
import TopicCard from './components/TopicCard';
import { AuthContext } from '../../../components/AuthenticationContext';
import { SKIP_TO_CONTENT_ID } from '../../../constants';
import { getAllDimensions } from '../../../util/trackingUtil';
import { useCreateArenaTopic } from '../arenaMutations';
import { arenaCategoryQuery, useArenaCategory } from '../arenaQueries';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
`;

const ListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  margin: 0;
  padding: 0;
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.large} 0 ${spacing.normal};
`;

const StyledCardContainer = styled.li`
  display: flex;
  flex-direction: column;
  margin: 0;
`;

const toArenaTopic = (topicId: number | undefined) =>
  `/minndla/arena/topic/${topicId}`;

const TopicPage = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const { trackPageView } = useTracker();
  const navigate = useNavigate();

  const { loading, arenaCategory } = useArenaCategory({
    variables: { categoryId: Number(categoryId), page: 1 },
    skip: !Number(categoryId),
  });
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || !loading) return;
    trackPageView({
      title: t('htmlTitles.arenaTopicPage', { name: arenaCategory?.name }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaCategory?.name, authContextLoaded, loading, t, trackPageView, user]);

  const { createArenaTopic } = useCreateArenaTopic({
    refetchQueries: [
      {
        query: arenaCategoryQuery,
        variables: { categoryId: arenaCategory?.id, page: 1 },
      },
    ],
  });

  const createTopic = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      if (arenaCategory) {
        const topic = await createArenaTopic({
          variables: {
            content: data.content ?? '',
            title: data.title ?? '',
            categoryId: arenaCategory?.id,
          },
        });
        navigate(toArenaTopic(topic.data?.newArenaTopic?.id));
      }
    },
    [arenaCategory, createArenaTopic, navigate],
  );

  const dropDownMenu = useMemo(() => <ArenaActions inTopic />, []);

  const arenaButtons = useMemo(() => <ArenaButtons inTopic />, []);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
  }

  return (
    <MyNdlaPageWrapper buttons={arenaButtons} dropDownMenu={dropDownMenu}>
      <HelmetWithTracker
        title={t('htmlTitles.arenaTopicPage', { name: arenaCategory?.name })}
      />
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
      <Heading
        element="h1"
        id={SKIP_TO_CONTENT_ID}
        headingStyle="h1-resource"
        margin="small"
      >
        {arenaCategory?.name}
      </Heading>
      <Text element="p" textStyle="content-alt" margin="none">
        {arenaCategory?.description}
      </Text>
      <StyledContainer>
        <Heading element="h2" headingStyle="h2" margin="none">
          {t('myNdla.arena.category.posts')}
        </Heading>
        <ArenaTextModal type="topic" onSave={createTopic} />
      </StyledContainer>
      <ListWrapper>
        {arenaCategory?.topics
          ?.filter(({ deleted }) => !deleted)
          .map((topic) => (
            <StyledCardContainer key={`topicContainer-${topic.id}`}>
              <TopicCard
                key={`topic-${topic.id}`}
                id={topic.id}
                title={topic.title}
                timestamp={topic.timestamp}
                count={topic.postCount}
              />
            </StyledCardContainer>
          ))}
      </ListWrapper>
    </MyNdlaPageWrapper>
  );
};

export default TopicPage;
