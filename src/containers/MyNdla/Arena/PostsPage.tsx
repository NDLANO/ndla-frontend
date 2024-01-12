/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { spacing, spacingUnit, mq, breakpoints } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import { useSnack } from '@ndla/ui';
import DeletedPostCard from './components/DeletedPostCard';
import PostCard from './components/PostCard';
import { AuthContext } from '../../../components/AuthenticationContext';
import { getAllDimensions } from '../../../util/trackingUtil';
import {
  useSubscribeToTopicMutation,
  useUnsubscribeFromTopicMutation,
} from '../arenaMutations';
import {
  useArenaCategory,
  useArenaNotifications,
  useArenaTopic,
} from '../arenaQueries';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
  padding-bottom: ${spacing.large};
`;

const ListWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const PostCardWrapper = styled.li`
  list-style: none;
  padding: 0;
  margin-bottom: ${spacing.normal};

  ${mq.range({ from: breakpoints.tablet })} {
    &[data-main-post='false'] {
      margin-left: ${spacingUnit * 3}px;
    }
  }
`;

const PostsPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const { addSnack } = useSnack();
  const navigate = useNavigate();
  const { refetch } = useArenaNotifications();
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const { arenaTopic, loading, error } = useArenaTopic({
    variables: { topicId: Number(topicId), page: 1 },
    skip: !Number(topicId),
    onCompleted() {
      refetch();
    },
  });

  const { arenaCategory } = useArenaCategory({
    variables: { categoryId: Number(arenaTopic?.categoryId), page: 1 },
    skip: !Number(arenaTopic?.categoryId),
  });
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  const [subscribeToTopic] = useSubscribeToTopicMutation();
  const [unsubscribeFromTopic] = useUnsubscribeFromTopicMutation();

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t('htmlTitles.arenaPostPage', { name: arenaTopic?.title ?? '' }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

  const onFollowChange = useCallback(() => {
    if (!arenaTopic) return;
    if (arenaTopic?.isFollowing) {
      unsubscribeFromTopic({ variables: { topicId: arenaTopic.id } });
      addSnack({
        content: t('myNdla.arena.notification.unsubscribe'),
        id: 'myNdla.arena.notification.unsubscribe',
      });
    } else {
      subscribeToTopic({ variables: { topicId: arenaTopic.id } });
      addSnack({
        content: t('myNdla.arena.notification.subscribe'),
        id: 'myNdla.arena.notification.subscribe',
      });
    }
  }, [arenaTopic, subscribeToTopic, unsubscribeFromTopic, addSnack, t]);

  useEffect(() => {
    if (document.getElementById(`post-${focusId}`)) {
      setTimeout(
        () =>
          document
            .getElementById(`post-${focusId}`)
            ?.getElementsByTagName('a')?.[0]
            ?.focus(),
        1,
      );
      setFocusId(undefined);
    }
  }, [focusId, arenaTopic?.posts]);

  useEffect(() => {
    if (
      error?.graphQLErrors.map((err) => err.extensions.status).includes(403) ||
      arenaTopic?.deleted ||
      (!loading && !arenaTopic)
    ) {
      if (document.referrer.includes('/minndla')) {
        navigate(-1);
      } else {
        navigate('/minndla/arena');
      }
      addSnack({
        content: t('myNdla.arena.topic.isDeleted'),
        id: 'myNdla.arena.topic.isDeleted',
      });
    }
  }, [error, arenaTopic, navigate, addSnack, t, loading]);

  if (loading) {
    return <Spinner />;
  }

  if (!user?.arenaEnabled && user?.arenaEnabled !== undefined) {
    return <Navigate to="/minndla" />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker
        title={t('htmlTitles.arenaPostPage', { name: arenaTopic?.title })}
      />
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={
            topicId
              ? [
                  {
                    name: arenaCategory?.name ?? '',
                    id: `category/${arenaTopic?.categoryId}`,
                  },
                  { name: arenaTopic?.title ?? '', id: topicId },
                ]
              : []
          }
          page={'arena'}
        />
      </BreadcrumbWrapper>
      <ListWrapper>
        {arenaTopic?.posts?.map((post) => (
          <PostCardWrapper key={post.id} data-main-post={post.isMainPost}>
            {post.deleted ? (
              <DeletedPostCard />
            ) : (
              <PostCard
                post={post}
                topic={arenaTopic}
                onFollowChange={onFollowChange}
                setFocusId={setFocusId}
              />
            )}
          </PostCardWrapper>
        ))}
      </ListWrapper>
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
