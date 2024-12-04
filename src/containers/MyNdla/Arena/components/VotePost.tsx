/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThumbFilled, Thumb } from "@ndla/icons";
import { IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useArenaPostUpvote, useArenaPostRemoveUpvote } from "./temporaryNodebbHooks";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { GQLArenaPostV2Fragment } from "../../../../graphqlTypes";

const UpvoteWrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: "xxsmall",
  },
});

interface Props {
  post: Omit<GQLArenaPostV2Fragment, "replies">;
}

const VotePost = ({ post }: Props) => {
  const { user } = useContext(AuthContext);
  const { upvotePost } = useArenaPostUpvote(post.topicId);
  const { removeUpvotePost } = useArenaPostRemoveUpvote(post.topicId);
  const { t } = useTranslation();

  const isOwner = post.owner?.id === user?.id;

  return (
    <UpvoteWrapper>
      {!isOwner && (
        <IconButton
          aria-label={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
          title={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
          variant="tertiary"
          onClick={() =>
            post.upvoted
              ? removeUpvotePost({ variables: { postId: post.id } })
              : upvotePost({ variables: { postId: post.id } })
          }
        >
          {post.upvoted || isOwner ? <ThumbFilled /> : <Thumb />}
        </IconButton>
      )}
      <Text
        textStyle="body.large"
        aria-label={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
        title={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
        consumeCss
        asChild
      >
        <span>{post.upvotes ?? 0}</span>
      </Text>
    </UpvoteWrapper>
  );
};

export default VotePost;
