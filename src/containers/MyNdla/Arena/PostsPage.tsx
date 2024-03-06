/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, spacingUnit, mq, breakpoints } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useSnack } from "@ndla/ui";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./components/ArenaForm";
import DeletedPostCard from "./components/DeletedPostCard";
import PostCard from "./components/PostCard";
import {
  useArenaTopic,
  useArenaCategory,
  useArenaFollowTopicMutation,
  useArenaReplyToTopicMutation,
  useArenaUnfollowTopicMutation,
} from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const StyledArenaFormWrapper = styled(ArenaFormWrapper)`
  ${mq.range({ from: breakpoints.tablet })} {
    margin-left: ${spacing.xlarge};
  }
`;

const StyledReplyButton = styled(ButtonV2)`
  float: right;
  &[hidden] {
    display: none;
  }
`;

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
  const [isReplying, setIsReplying] = useState(false);
  const { t } = useTranslation();
  const { topicId } = useParams();
  const { addSnack } = useSnack();
  const navigate = useNavigate();
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const postPage = 1;
  const postPageSize = 100;
  const { arenaTopic, loading, error } = useArenaTopic(topicId, postPage, postPageSize);
  const replyToRef = useRef<HTMLButtonElement | null>(null);

  const { arenaCategory } = useArenaCategory(arenaTopic?.categoryId?.toString());
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  const [subscribeToTopic] = useArenaFollowTopicMutation();
  const { replyToTopic } = useArenaReplyToTopicMutation(Number(topicId));
  const [unsubscribeFromTopic] = useArenaUnfollowTopicMutation();

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t("htmlTitles.arenaPostPage", { name: arenaTopic?.title ?? "" }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      const newReply = await replyToTopic({
        variables: { topicId: Number(topicId), content: data.content ?? "" },
      });

      // TODO: Replace this with `setFocusId(newReply.data.replyToTopicV2.id)` when nodebb dies
      if (!newReply.data) return;
      if ("replyToTopic" in newReply.data) {
        setFocusId(newReply.data.replyToTopic.id);
      }
      if ("replyToTopicV2" in newReply.data) {
        setFocusId(newReply.data.replyToTopicV2.id);
      }
    },
    [replyToTopic, topicId, setFocusId],
  );

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
                  createReply={createReply}
                />
              )}
            </PostCardWrapper>
          );
        })}
      </ListWrapper>
      <StyledReplyButton
        aria-expanded={isReplying}
        ref={replyToRef}
        onClick={() => setIsReplying(true)}
        hidden={isReplying || !!arenaTopic?.isLocked}
      >
        {t("myNdla.arena.new.post")}
      </StyledReplyButton>
      {isReplying && (
        <StyledArenaFormWrapper>
          <ArenaForm
            id={`bottom${topicId ? `-${topicId}` : ""}`}
            onAbort={async () => {
              setIsReplying(false);
              setTimeout(() => replyToRef.current?.focus(), 1);
            }}
            type="post"
            onSave={async (values) => {
              await createReply(values);
              setIsReplying(false);
            }}
          />
        </StyledArenaFormWrapper>
      )}
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
