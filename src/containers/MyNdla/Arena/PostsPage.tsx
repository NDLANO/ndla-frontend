/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing, spacingUnit, mq, breakpoints } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useSnack } from "@ndla/ui";
import DeletedPostCard from "./components/DeletedPostCard";
import PostCard from "./components/PostCard";
import {
  useArenaTopic,
  useArenaCategory,
  useArenaFollowTopicMutation,
  useArenaUnfollowTopicMutation,
} from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

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
    &[data-main-post="false"] {
      margin-left: ${spacingUnit * 3}px;
    }
  }
`;

const PostsPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const { addSnack } = useSnack();
  const navigate = useNavigate();
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const postPage = 1;
  const postPageSize = 100;
  const { arenaTopic, loading, error } = useArenaTopic(topicId, postPage, postPageSize);

  const { arenaCategory } = useArenaCategory(arenaTopic?.categoryId?.toString());
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  const [subscribeToTopic] = useArenaFollowTopicMutation();
  const [unsubscribeFromTopic] = useArenaUnfollowTopicMutation();

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t("htmlTitles.arenaPostPage", { name: arenaTopic?.title ?? "" }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

  const onFollowChange = useCallback(() => {
    if (!arenaTopic) return;
    if (arenaTopic?.isFollowing) {
      unsubscribeFromTopic({ variables: { topicId: arenaTopic.id } });
      addSnack({
        content: t("myNdla.arena.notification.unsubscribe"),
        id: "myNdla.arena.notification.unsubscribe",
      });
    } else {
      subscribeToTopic({ variables: { topicId: arenaTopic.id } });
      addSnack({
        content: t("myNdla.arena.notification.subscribe"),
        id: "myNdla.arena.notification.subscribe",
      });
    }
  }, [arenaTopic, subscribeToTopic, unsubscribeFromTopic, addSnack, t]);

  useEffect(() => {
    if (document.getElementById(`post-${focusId}`)) {
      setTimeout(() => document.getElementById(`post-${focusId}`)?.getElementsByTagName("a")?.[0]?.focus(), 1);
      setFocusId(undefined);
    }
  }, [focusId, arenaTopic?.posts]);

  useEffect(() => {
    if (error?.graphQLErrors.map((err) => err.extensions.status).includes(403) || (!loading && !arenaTopic)) {
      if (document.referrer.includes(routes.myNdla.root)) {
        navigate(-1);
      } else {
        navigate(routes.myNdla.arena);
      }
      addSnack({
        content: t("myNdla.arena.topic.isDeleted"),
        id: "myNdla.arena.topic.isDeleted",
      });
    }
  }, [error, arenaTopic, navigate, addSnack, t, loading]);

  if (loading) return <Spinner />;
  if (authContextLoaded && !user?.arenaEnabled) {
    return <Navigate to={routes.myNdla.root} />;
  }

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaPostPage", { name: arenaTopic?.title })} />
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={
            topicId
              ? [
                  {
                    name: arenaCategory?.title ?? "",
                    id: `category/${arenaTopic?.categoryId}`,
                  },
                  { name: arenaTopic?.title ?? "", id: topicId },
                ]
              : []
          }
          page={"arena"}
        />
      </BreadcrumbWrapper>
      <ListWrapper>
        {arenaTopic?.posts?.items?.map((post, postIdx) => {
          const isMainPost = postIdx === 0 && postPage === 1;
          return (
            <PostCardWrapper key={post.id} data-main-post={isMainPost}>
              {/* @ts-ignore TODO: Delete this when nodebb is gone */}
              {post.deleted ? (
                <DeletedPostCard />
              ) : (
                <PostCard
                  post={post}
                  topic={arenaTopic}
                  onFollowChange={onFollowChange}
                  setFocusId={setFocusId}
                  isMainPost={isMainPost}
                />
              )}
            </PostCardWrapper>
          );
        })}
      </ListWrapper>
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
