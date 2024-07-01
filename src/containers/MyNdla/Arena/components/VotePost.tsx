/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { ThumbFilled, Thumb } from "@ndla/icons/action";
import { Text } from "@ndla/typography";
import { useArenaPostUpvote, useArenaPostRemoveUpvote } from "./temporaryNodebbHooks";
import { AuthContext } from "../../../../components/AuthenticationContext";
import { GQLArenaPostV2Fragment } from "../../../../graphqlTypes";

const UpvoteWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.nsmall};
`;

const AmountOfUpvotes = styled(Text)`
  align-self: center;
`;

interface Props {
  post: Omit<GQLArenaPostV2Fragment, "replies">;
}

const VotePost = ({ post }: Props) => {
  const { user } = useContext(AuthContext);
  const { upvotePost } = useArenaPostUpvote(post.topicId);
  const { removeUpvotePost } = useArenaPostRemoveUpvote(post.topicId);
  const { t } = useTranslation();

  const isOwner = post.owner?.id !== user?.id;

  return (
    <UpvoteWrapper>
      <IconButtonV2
        aria-label={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
        title={post.upvoted ? t("myNdla.arena.posts.removeUpvote") : t("myNdla.arena.posts.upvote")}
        variant={isOwner ? "stripped" : "ghost"}
        colorTheme="light"
        onClick={() =>
          post.upvoted
            ? removeUpvotePost({ variables: { postId: post.id } })
            : upvotePost({ variables: { postId: post.id } })
        }
        disabled={isOwner}
      >
        {post.upvoted || isOwner ? <ThumbFilled /> : <Thumb />}
      </IconButtonV2>

      <AmountOfUpvotes
        element="span"
        textStyle="content-alt"
        margin="none"
        aria-label={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
        title={t("myNdla.arena.posts.numberOfUpvotes", { count: post.upvotes })}
      >
        {post.upvotes ?? 0}
      </AmountOfUpvotes>
    </UpvoteWrapper>
  );
};

export default VotePost;
