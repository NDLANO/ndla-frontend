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
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { useSnack } from "@ndla/ui";
import { ArenaFormValues } from "./components/ArenaForm";
import MainPostCard from "./components/MainPostCard";
import PostList from "./components/PostList";
import {
  useArenaTopic,
  useArenaCategory,
  useArenaFollowTopicMutation,
  useArenaUnfollowTopicMutation,
  useArenaReplyToTopicMutation,
} from "./components/temporaryNodebbHooks";
import { AuthContext } from "../../../components/AuthenticationContext";
import { GQLArenaPostV2Fragment, GQLArenaTopicV2 } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const BreadcrumbWrapper = styled.div`
  padding-top: ${spacing.normal};
  padding-bottom: ${spacing.large};
`;

const StyledReplyButton = styled(ButtonV2)`
  float: right;
  &[hidden] {
    display: none;
  }
`;

const POST_PAGE = 1;
const POST_PAGE_SIZE = 100;

const PostsPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const { addSnack } = useSnack();
  const navigate = useNavigate();
  const [focusId, setFocusId] = useState<number | undefined>(undefined);
  const [replyingTo, setReplyingTo] = useState<number | undefined>(undefined);
  const { arenaTopic, loading, error } = useArenaTopic(topicId, POST_PAGE, POST_PAGE_SIZE);

  const { arenaCategory } = useArenaCategory(arenaTopic?.categoryId?.toString());
  const { trackPageView } = useTracker();
  const { user, authContextLoaded, authenticated } = useContext(AuthContext);

  const [subscribeToTopic] = useArenaFollowTopicMutation();
  const [unsubscribeFromTopic] = useArenaUnfollowTopicMutation();
  const { replyToTopic } = useArenaReplyToTopicMutation(arenaTopic?.id!);

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>, postId?: number) => {
      const newReply = await replyToTopic({
        variables: { topicId: arenaTopic?.id!, content: data.content ?? "", postId: postId },
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
    [replyToTopic, arenaTopic?.id, setFocusId],
  );
  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t("htmlTitles.arenaPostPage", { name: arenaTopic?.title ?? "" }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

  const onFollowChange = useCallback(async () => {
    if (!arenaTopic) return;
    if (arenaTopic?.isFollowing) {
      await unsubscribeFromTopic({ variables: { topicId: arenaTopic.id } });
      addSnack({
        content: t("myNdla.arena.notification.unsubscribe"),
        id: "myNdla.arena.notification.unsubscribe",
      });
    } else {
      await subscribeToTopic({ variables: { topicId: arenaTopic.id } });
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

  const parentCrumbs =
    arenaCategory?.breadcrumbs?.map((crumb) => ({ name: crumb.title, id: `category/${crumb.id}` })) ?? [];
  const crumbs = [...parentCrumbs, { name: arenaTopic?.title ?? "", id: topicId ?? "" }];

  if (loading || !authContextLoaded || !arenaTopic?.posts?.items) return <Spinner />;
  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.arena} />;

  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("htmlTitles.arenaPostPage", { name: arenaTopic?.title })} />
      <BreadcrumbWrapper>
        <MyNdlaBreadcrumb breadcrumbs={crumbs} page={"arena"} />
      </BreadcrumbWrapper>
      <MainPostCard
        post={arenaTopic.posts.items[0]!}
        topic={arenaTopic}
        onFollowChange={onFollowChange}
        setFocusId={setFocusId}
        setReplyingTo={() => setReplyingTo(arenaTopic.id)}
        isReplying={!!replyingTo}
      />
      <PostList
        posts={arenaTopic?.posts?.items.slice(1) as GQLArenaPostV2Fragment[]}
        topic={arenaTopic as GQLArenaTopicV2}
        setFocusId={setFocusId}
        createReply={createReply}
        replyToId={arenaTopic.id}
        isReplyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
      />
      <StyledReplyButton
        aria-expanded={!!replyingTo}
        onClick={() => setReplyingTo(arenaTopic?.id)}
        hidden={!!replyingTo || !!arenaTopic?.isLocked}
      >
        {t("myNdla.arena.new.post")}
      </StyledReplyButton>
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
