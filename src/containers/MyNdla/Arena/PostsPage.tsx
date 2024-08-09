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
import { Button, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
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
import { useToast } from "../../../components/ToastContext";
import { routes } from "../../../routeHelpers";
import { getAllDimensions } from "../../../util/trackingUtil";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";

const PageWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "large",
    paddingBlock: "medium",
  },
});

const StyledReplyButton = styled(Button, {
  base: {
    float: "right",
    "&[hidden]": {
      display: "none",
    },
  },
});

const POST_PAGE = 1;
const POST_PAGE_SIZE = 100;

const PostsPage = () => {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const toast = useToast();
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

  const onFollowChange = useCallback(async () => {
    if (!arenaTopic) return;
    if (arenaTopic?.isFollowing) {
      await unsubscribeFromTopic({ variables: { topicId: arenaTopic.id } });
      toast.create({
        title: t("myNdla.arena.notification.unsubscribe"),
      });
    } else {
      await subscribeToTopic({ variables: { topicId: arenaTopic.id } });
      toast.create({
        title: t("myNdla.arena.notification.subscribe"),
      });
    }
  }, [arenaTopic, unsubscribeFromTopic, toast, t, subscribeToTopic]);

  useEffect(() => {
    if (!authContextLoaded || !user?.arenaEnabled || loading) return;
    trackPageView({
      title: t("htmlTitles.arenaPostPage", { name: arenaTopic?.title ?? "" }),
      dimensions: getAllDimensions({ user }),
    });
  }, [arenaTopic?.title, authContextLoaded, loading, t, trackPageView, user]);

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
      toast.create({
        title: t("myNdla.arena.topic.isDeleted"),
      });
    }
  }, [error, arenaTopic, navigate, t, loading, toast]);

  const parentCrumbs =
    arenaCategory?.breadcrumbs?.map((crumb) => ({ name: crumb.title, id: `category/${crumb.id}` })) ?? [];
  const crumbs = [...parentCrumbs, { name: arenaTopic?.title ?? "", id: topicId ?? "" }];

  if (loading || !authContextLoaded || !arenaTopic?.posts?.items) return <Spinner />;
  if (!authenticated || (user && !user.arenaEnabled)) return <Navigate to={routes.myNdla.root} />;

  return (
    <MyNdlaPageWrapper>
      <PageWrapper>
        <HelmetWithTracker title={t("htmlTitles.arenaPostPage", { name: arenaTopic?.title })} />
        <MyNdlaBreadcrumb breadcrumbs={crumbs} page={"arena"} />
        <div>
          <MainPostCard
            post={arenaTopic?.posts?.items[0]!}
            topic={arenaTopic}
            onFollowChange={onFollowChange}
            setFocusId={setFocusId}
            setReplyingTo={() => setReplyingTo(arenaTopic.id)}
            isReplying={!!replyingTo}
          />
          <PostList
            posts={arenaTopic?.posts?.items.slice(1)}
            topic={arenaTopic}
            setFocusId={setFocusId}
            createReply={createReply}
            replyToId={arenaTopic.id}
            isReplyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
          />
        </div>
        <div>
          <StyledReplyButton
            aria-expanded={!!replyingTo}
            onClick={() => setReplyingTo(arenaTopic?.id)}
            hidden={!!replyingTo || !!arenaTopic?.isLocked}
          >
            {t("myNdla.arena.new.post")}
          </StyledReplyButton>
        </div>
      </PageWrapper>
    </MyNdlaPageWrapper>
  );
};

export default PostsPage;
