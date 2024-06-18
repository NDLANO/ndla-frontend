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
import { GQLArenaPostV2Fragment, GQLArenaTopicV2, GQLPaginatedPosts } from "../../../../graphqlTypes";

const StyledOl = styled.ol`
  list-style: none;
  margin-left: ${spacing.xlarge};
  padding: unset;

  li {
    padding: unset;
  }
`;

export const StyledArenaFormWrapper = styled(ArenaFormWrapper)`
  margin-bottom: ${spacing.normal};
  ${mq.range({ from: breakpoints.tablet })} {
    margin-left: ${spacing.xlarge};
  }
`;

const calculateNextPostId = (
  posts: GQLArenaPostV2Fragment[] | Omit<GQLArenaPostV2Fragment, "replies">[],
  post: GQLArenaPostV2Fragment | Omit<GQLArenaPostV2Fragment, "replies">,
  rootPosts?: GQLPaginatedPosts,
) => {
  const index = posts?.findIndex(({ id }) => id === post.id) ?? 0;
  const previousPostId = posts?.[index - 1]?.id;
  const nextPostId = posts?.[index + 1]?.id;
  if (!previousPostId || !nextPostId) {
    return rootPosts?.items.find(({ replies }) => replies.find((replyPost) => replyPost.id === post.id))?.id;
  }
  return nextPostId ?? previousPostId;
};

interface Props {
  posts: GQLArenaPostV2Fragment[] | Omit<GQLArenaPostV2Fragment, "replies">[];
  topic: GQLArenaTopicV2;
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
                  nextPostId={calculateNextPostId(posts, post, topic.posts) ?? topic.id}
                  setIsReplying={() => (hasReplies ? setIsReplyingChild(post.id) : setReplyingTo(replyToId))}
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
              replyToId === topic.id ? await createReply(values) : await createReply(values, replyToId);
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
