/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, Dispatch, SetStateAction, useRef, useEffect } from "react";
import { styled } from "@ndla/styled-system/jsx";
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from "./ArenaForm";
import DeletedPostCard from "./DeletedPostCard";
import PostCard from "./PostCard";
import { GQLArenaPostV2Fragment, GQLArenaTopicByIdV2Query } from "../../../../graphqlTypes";

const StyledOl = styled("ol", {
  base: {
    marginInlineStart: "xsmall",
    tablet: {
      marginInlineStart: "small",
    },
    desktop: {
      marginInlineStart: "medium",
    },
  },
});

const StyledLi = styled("li", {
  base: {
    position: "relative",
    paddingBlockStart: "2xsmall",
    paddingInlineStart: "xsmall",
    borderInlineStart: "1px solid",
    borderColor: "stroke.subtle",
    "&:last-of-type": {
      borderInlineStart: "unset",
    },
    "&:not(:last-of-type)": {
      _after: {
        borderInlineStart: "unset",
      },
    },
    _after: {
      borderInlineStart: "1px solid",
      borderBlockEnd: "1px solid",
      borderColor: "stroke.subtle",
      borderBottomLeftRadius: "xsmall",
      position: "absolute",
      content: "''",
      width: "xsmall",
      height: "3xlarge",
      left: "0px",
      top: "-medium",
    },
    tablet: {
      paddingBlockStart: "small",
      paddingInlineStart: "medium",
      _after: {
        width: "large",
        height: "3xlarge",
        top: "-xsmall",
      },
    },
    desktop: {
      paddingBlockStart: "medium",
      paddingInlineStart: "large",
      _after: {
        width: "large",
        height: "3xlarge",
        top: "-xsmall",
      },
    },
  },
});

const StyledArenaFormWrapper = styled(ArenaFormWrapper, {
  base: {
    marginBlockStart: "medium",
    marginInlineStart: "3xlarge",
    tablet: {
      marginInlineStart: "unset",
    },
  },
});

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

  const formRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isReplyingTo === replyToId) {
      formRef?.current?.scrollIntoView();
    }
  }, [replyToId, isReplyingTo]);

  return (
    <>
      <StyledOl>
        {posts.map((post) => {
          const hasReplies = "replies" in post;
          return (
            <StyledLi key={post.id}>
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
            </StyledLi>
          );
        })}
      </StyledOl>
      {isReplyingTo === replyToId && (
        <StyledArenaFormWrapper ref={formRef}>
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
