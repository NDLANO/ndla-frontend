/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, Dispatch, SetStateAction } from "react";
import styled from "@emotion/styled";
import { breakpoints, mq, spacing } from "@ndla/core";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./ArenaForm";
import DeletedPostCard from "./DeletedPostCard";
import PostCard from "./PostCard";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";

const StyledOl = styled.ol`
  list-style: none;
  margin-left: ${spacing.xlarge};
  padding: unset;

  li {
    padding: unset;
  }
`;

const StyledArenaFormWrapper = styled(ArenaFormWrapper)`
  margin-bottom: ${spacing.normal};
  ${mq.range({ from: breakpoints.tablet })} {
    margin-left: ${spacing.xlarge};
  }
`;

const calculateNextPostId = (
  posts: GQLArenaPostV2Fragment[] | Omit<GQLArenaPostV2Fragment, "replies">[],
  post: GQLArenaPostV2Fragment | Omit<GQLArenaPostV2Fragment, "replies">,
  rootPosts?: GQLArenaTopicByIdV2Query["arenaTopicV2"],
) => {
  const index = posts?.findIndex(({ id }) => id === post.id) ?? 0;
  const previousPostId = posts?.[index - 1]?.id;
  const nextPostId = posts?.[index + 1]?.id;
  if (previousPostId || nextPostId) {
    return nextPostId ?? previousPostId;
  }
  return rootPosts?.posts?.items.find(({ replies }) => {
    return replies?.find(({ id }) => id === post.id);
  })?.id;
};

interface Props {
  posts: GQLArenaPostV2Fragment[] | Omit<GQLArenaPostV2Fragment, "replies">[];
  topic: GQLArenaTopicByIdV2Query["arenaTopicV2"];
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
  setReplyingTo: Dispatch<SetStateAction<number | undefined>>;
  createReply: (values: Partial<ArenaFormValues>, postId?: number) => Promise<void>;
  replyToId: number;
  isReplyingTo?: number;
}

const PostList = ({ posts, topic, setFocusId, createReply, replyToId, isReplyingTo, setReplyingTo }: Props) => {
  const [isReplyingChild, setIsReplyingChild] = useState<number | undefined>(undefined);

  return (
    <>
      <StyledOl>
        {posts.map((post) => {
          const hasReplies = "replies" in post;
          return (
            <li key={post.id}>
              {"deleted" in post && post.deleted ? (
                <DeletedPostCard />
              ) : (
                <PostCard
                  post={post}
                  setFocusId={setFocusId}
                  nextPostId={calculateNextPostId(posts, post, topic) ?? topic?.id ?? 0}
                  setIsReplying={() => (hasReplies ? setIsReplyingChild(post.id) : setReplyingTo(replyToId))}
                  isRoot={hasReplies}
                />
              )}
              {hasReplies && (
                <PostList
                  posts={post.replies}
                  topic={topic}
                  setFocusId={setFocusId}
                  createReply={createReply}
                  replyToId={post.id}
                  isReplyingTo={isReplyingChild}
                  setReplyingTo={setIsReplyingChild}
                />
              )}
            </li>
          );
        })}
      </StyledOl>
      {isReplyingTo === replyToId && (
        <StyledArenaFormWrapper>
          <ArenaForm
            type="post"
            onAbort={() => {
              setIsReplyingChild(undefined);
              setReplyingTo(undefined);
            }}
            onSave={async (values) => {
              await createReply(values, replyToId !== topic?.id ? replyToId : undefined);
              setIsReplyingChild(undefined);
              setReplyingTo(undefined);
            }}
          />
        </StyledArenaFormWrapper>
      )}
    </>
  );
};

export default PostList;
