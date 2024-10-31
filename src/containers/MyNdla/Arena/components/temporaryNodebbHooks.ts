/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError, MutationFunctionOptions } from "@apollo/client";
import config from "../../../../config";
import {
  Exact,
  GQLArenaCategoryFragment,
  GQLArenaCategoryV2Fragment,
  GQLArenaNotificationV2Fragment,
  GQLArenaPostFragment,
  GQLArenaPostV2Fragment,
  GQLArenaTopicFragment,
  GQLArenaTopicV2Fragment,
  GQLPaginatedNotificationsFragment,
  GQLPaginatedPostsFragment,
  GQLTopiclessArenaCategoryV2Fragment,
  GQLUpdateTopicV2Mutation,
} from "../../../../graphqlTypes";
import * as myndlaMutations from "../../arenaMutations";
import * as myndlaQueries from "../../arenaQueries";
import * as nodebbMutations from "../../nodebbMutations";
import * as nodebbQueries from "../../nodebbQueries";

type ConvertedType =
  | (GQLArenaCategoryV2Fragment & GQLTopiclessArenaCategoryV2Fragment)
  | {
      topics?: GQLArenaTopicV2Fragment[];
    };

export const convertNodebbCategoryToMyndlaCategory = (
  nodebbArenaCategory: (GQLArenaCategoryFragment & { topics?: GQLArenaTopicFragment[] }) | undefined,
): ConvertedType | undefined => {
  if (!nodebbArenaCategory) return undefined;

  const subcategories: (ConvertedType | undefined)[] | undefined = nodebbArenaCategory?.children?.map((child) => {
    return convertNodebbCategoryToMyndlaCategory(child);
  });

  const topics: GQLArenaTopicV2Fragment[] | undefined = nodebbArenaCategory?.topics
    ?.filter(({ deleted }) => !deleted)
    ?.map((topic) => {
      return {
        ...topic,
        __typename: "ArenaTopicV2",
        created: topic.timestamp,
        isLocked: topic.locked,
        updated: topic.timestamp,
      } as GQLArenaTopicV2Fragment;
    });

  return {
    ...nodebbArenaCategory,
    __typename: "ArenaCategoryV2",
    title: nodebbArenaCategory?.name,
    visible: true,
    topicCount: nodebbArenaCategory.topicCount,
    postCount: 0,
    isFollowing: false,
    subcategories,
    topics,
  } as GQLArenaCategoryV2Fragment & { topics?: GQLArenaTopicV2Fragment[] };
};

// NOTE: This file contains hooks that will be removed when nodebb is dead
export const useArenaCategory: (categoryId: string | undefined) => {
  loading: boolean;
  arenaCategory: (GQLArenaCategoryV2Fragment & { topics?: GQLArenaTopicV2Fragment[] }) | undefined;
  refetch: () => void;
} = (categoryId: string | undefined) => {
  const { loading, arenaCategory, refetch } = myndlaQueries.useArenaCategory({
    variables: { categoryId: Number(categoryId), page: 1 },
    skip: !Number(categoryId) || config.enableNodeBB,
  });

  const { loading: nodebbLoading, arenaCategory: nodebbArenaCategory } = nodebbQueries.useArenaCategory({
    variables: { categoryId: Number(categoryId), page: 1 },
    skip: !Number(categoryId) || !config.enableNodeBB,
  });

  if (config.enableNodeBB)
    return {
      loading: nodebbLoading,
      arenaCategory: convertNodebbCategoryToMyndlaCategory(nodebbArenaCategory) as
        | (GQLArenaCategoryV2Fragment & { topics?: GQLArenaTopicV2Fragment[] })
        | undefined,
      refetch: () => {},
    };

  return { loading, arenaCategory, refetch };
};

export const useArenaCategories: () => {
  loading: boolean;
  error: ApolloError | undefined;
  arenaCategories: (GQLArenaCategoryV2Fragment & { topics?: GQLArenaTopicV2Fragment })[] | undefined;
  refetch: () => void;
} = () => {
  const nodebb = config.enableNodeBB;
  const {
    arenaCategories: nodebbArenaCategories,
    loading: nodebbLoading,
    error: nodebbError,
    refetch: nodebbRefetch,
  } = nodebbQueries.useArenaCategories({
    skip: !nodebb,
  });
  const { arenaCategories, loading, error, refetch } = myndlaQueries.useArenaCategoriesV2({
    skip: nodebb,
  });

  if (nodebb) {
    return {
      arenaCategories: nodebbArenaCategories?.map((cat) => convertNodebbCategoryToMyndlaCategory(cat)) as
        | GQLArenaCategoryV2Fragment[]
        | undefined,
      loading: nodebbLoading,
      error: nodebbError,
      refetch: nodebbRefetch,
    };
  }

  return {
    arenaCategories,
    loading,
    error,
    refetch,
  };
};

export const useArenaTopic = (topicId: string | undefined, postPage: number, postPageSize: number) => {
  const { refetch } = myndlaQueries.useArenaNotifications();
  const { arenaTopic, loading, error } = myndlaQueries.useArenaTopic({
    variables: {
      topicId: Number(topicId),
      page: postPage,
      pageSize: postPageSize,
    },
    skip: !Number(topicId) || config.enableNodeBB,
    onCompleted() {
      refetch();
    },
  });

  const { refetch: nodebbRefetch } = nodebbQueries.useArenaNotifications();

  const nodebbPostToArenaPost = (post: GQLArenaPostFragment) => {
    const owner = post.user
      ? {
          displayName: post.user.displayName,
          id: post.user.id,
          username: post.user.username,
          location: post.user.location,
          groups: [],
        }
      : undefined;
    return {
      ...post,
      __typename: "ArenaPostV2",
      contentAsHTML: post.content,
      created: post.timestamp,
      updated: post.timestamp,
      upvotes: post.upvotes,
      upvoted: post.upvoted,
      owner,
      replies: post.replies?.map((reply) => {
        const replyOwner = reply.user
          ? {
              displayName: reply.user.displayName,
              id: reply.user.id,
              username: reply.user.username,
              location: reply.user.location,
              groups: [],
            }
          : undefined;
        return {
          ...reply,
          __typename: "ArenaPostV2",
          contentAsHTML: reply.content,
          created: reply.timestamp,
          updated: reply.timestamp,
          upvotes: post.upvotes,
          upvoted: post.upvoted,
          owner: replyOwner,
        };
      }),
    } as GQLArenaPostV2Fragment;
  };

  const {
    arenaTopic: nodebbArenaTopic,
    loading: nodebbLoading,
    error: nodebbError,
  } = nodebbQueries.useArenaTopic({
    variables: {
      topicId: Number(topicId),
      page: postPage,
    },
    skip: !Number(topicId) || !config.enableNodeBB,
    onCompleted() {
      nodebbRefetch();
    },
  });

  if (!config.enableNodeBB) return { arenaTopic, loading, error };
  else {
    return {
      arenaTopic: {
        ...nodebbArenaTopic,
        __typename: "ArenaTopicV2",
        created: nodebbArenaTopic?.timestamp,
        updated: nodebbArenaTopic?.timestamp,
        posts: {
          __typename: "PaginatedPosts",
          totalCount: nodebbArenaTopic?.postCount,
          page: 1,
          pageSize: 100,
          items: nodebbArenaTopic?.posts?.map(nodebbPostToArenaPost),
        },
        isLocked: nodebbArenaTopic?.locked,
      } as GQLArenaTopicV2Fragment & {
        posts: GQLPaginatedPostsFragment & {
          items: (GQLArenaPostV2Fragment & { deleted?: boolean })[];
        };
      },
      loading: nodebbLoading,
      error: nodebbError,
    };
  }
};

export const useArenaUser = (username: string | number | undefined) => {
  const { arenaUser, loading } = myndlaQueries.useArenaUser({
    variables: { username: typeof username === "string" ? username : "" },
    skip: !username || config.enableNodeBB,
  });

  const id = typeof username === "number" ? username : -2;
  const { arenaUser: nodebbUser, loading: nodebbLoading } = nodebbQueries.useArenaUser({
    variables: { id },
    skip: !username || !config.enableNodeBB,
  });

  if (!config.enableNodeBB) return { arenaUser: { ...arenaUser, slug: undefined }, loading };
  else
    return {
      arenaUser: {
        ...nodebbUser,
        groups: nodebbUser?.groupTitleArray,
      },
      loading: nodebbLoading,
    };
};

export const useArenaTopicsByUser = (userId: number | undefined, userSlug: string | undefined) => {
  const { arenaTopicsByUser, loading } = myndlaQueries.useArenaTopicsByUser({
    variables: { userId: userId ?? 0 },
    skip: !userId || config.enableNodeBB,
  });

  const { arenaTopicsByUser: nodebbTopicsByUser, loading: nodebbLoading } = nodebbQueries.useArenaTopicsByUser({
    variables: { userSlug: userSlug },
    skip: !userSlug || !config.enableNodeBB,
  });

  if (!config.enableNodeBB) return { arenaTopicsByUser, loading };
  else {
    return {
      arenaTopicsByUser: {
        totalCount: nodebbTopicsByUser?.length,
        page: 1,
        pageSize: 100,
        items: nodebbTopicsByUser?.map((topic) => {
          return {
            ...topic,
            __typename: "ArenaTopicV2",
            created: topic?.timestamp,
            updated: topic?.timestamp,
          };
        }),
      },
      loading: nodebbLoading,
    };
  }
};

export const useArenaRecentTopics = (skip?: boolean, pageSize?: number) => {
  const { data, loading } = myndlaQueries.useArenaRecentTopics({
    skip: config.enableNodeBB || !!skip,
    variables: {
      pageSize,
    },
  });

  const { data: nodebbData, loading: nodebbLoading } = nodebbQueries.useRecentTopics({
    skip: !config.enableNodeBB || !!skip,
  });

  if (!config.enableNodeBB) return { data, loading };
  else {
    return {
      data: {
        totalCount: nodebbData?.length,
        page: 1,
        pageSize: pageSize,
        items: nodebbData?.slice(0, 5).map((topic) => {
          return {
            ...topic,
            __typename: "ArenaTopicV2",
            created: topic?.timestamp,
            updated: topic?.timestamp,
          };
        }),
      },
      loading: nodebbLoading,
    };
  }
};

export const useArenaFollowTopicMutation = () => {
  const subscribeToTopic = myndlaMutations.useFollowTopicMutation();
  const subscribeNodebbToTopic = nodebbMutations.useSubscribeToTopicMutation();

  if (config.enableNodeBB) return subscribeNodebbToTopic;
  else return subscribeToTopic;
};

export const useArenaUnfollowTopicMutation = () => {
  const unsubscribeToTopic = myndlaMutations.useUnsubscribeFromTopicMutation();
  const unsubscribeNodebbToTopic = nodebbMutations.useUnsubscribeFromTopicMutation();

  if (config.enableNodeBB) return unsubscribeNodebbToTopic;
  else return unsubscribeToTopic;
};

export const useArenaMarkNotificationsAsRead = () => {
  const markNotificationsAsRead = myndlaMutations.useMarkNotificationsAsRead();
  const markNodebbNotificationsAsRead = nodebbMutations.useMarkNotificationsAsRead();

  if (config.enableNodeBB) return markNodebbNotificationsAsRead;
  else return markNotificationsAsRead;
};

export const useArenaNewFlagMutation = () => {
  const newFlag = myndlaMutations.useNewFlagMutationV2();
  const newNodebbFlag = nodebbMutations.useNewFlagMutation();

  if (config.enableNodeBB) return newNodebbFlag;
  else return newFlag;
};

export const useArenaReplyToTopicMutation = (topicId: number) => {
  const replyToTopic = myndlaMutations.useReplyToTopicV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });

  const newNodebbReplyToTopic = nodebbMutations.useReplyToTopic({
    refetchQueries: [
      {
        query: nodebbQueries.arenaTopicById,
        variables: {
          topicId,
          page: 1,
          pageSize: 100,
        },
      },
    ],
  });

  if (config.enableNodeBB) return newNodebbReplyToTopic;
  else return replyToTopic;
};

export const useArenaUpdatePost = (topicId: number) => {
  const updatePost = myndlaMutations.useUpdatePostV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });
  const newNodebbUpdatePost = nodebbMutations.useUpdatePost({
    refetchQueries: [
      {
        query: nodebbQueries.arenaTopicById,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });

  if (config.enableNodeBB) return newNodebbUpdatePost;
  else return updatePost;
};

export const useArenaUpdateTopic = (topicId: number) => {
  const updateTopic = myndlaMutations.useUpdateTopicV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });
  const newNodebbUpdatePost = nodebbMutations.useUpdatePost({
    refetchQueries: [
      {
        query: nodebbQueries.arenaTopicById,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });

  if (config.enableNodeBB) {
    const nodebbUpdateTopicFunction = async (
      options?:
        | MutationFunctionOptions<GQLUpdateTopicV2Mutation, Exact<{ topicId: number; content: string; title: string }>>
        | undefined,
    ) => {
      const postId = options?.variables?.topicId;
      if (!postId) throw new Error("Missing topicId to updateTopic, this seems like a bug.");
      const content = options?.variables?.content ?? "";
      const title = options?.variables?.title;

      return newNodebbUpdatePost.updatePost({
        variables: {
          postId,
          title,
          content,
        },
      });
    };

    return { updateTopic: nodebbUpdateTopicFunction };
  } else return updateTopic;
};

export const useArenaDeletePost = (topicId: number) => {
  const deletePost = myndlaMutations.useDeletePostV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });
  const newNodebbDeletePost = nodebbMutations.useDeletePost({
    refetchQueries: [
      {
        query: nodebbQueries.arenaTopicById,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });

  if (config.enableNodeBB) return newNodebbDeletePost;
  else return deletePost;
};

export const useArenaDeleteTopic = (categoryId: number | undefined) => {
  const deleteTopic = myndlaMutations.useDeleteTopicV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaCategoryV2Query,
        variables: { categoryId, page: 1 },
      },
    ],
  });
  const newNodebbDeleteTopic = nodebbMutations.useDeleteTopic({
    refetchQueries: [
      {
        query: nodebbQueries.arenaCategoryQuery,
        variables: { categoryId, page: 1 },
      },
    ],
  });

  if (config.enableNodeBB) return newNodebbDeleteTopic;
  else return deleteTopic;
};

export const useArenaCreateTopic = (categoryId: string | undefined) => {
  const createArenaTopic = myndlaMutations.useCreateArenaTopicV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaCategoryV2Query,
        variables: { categoryId: Number(categoryId), page: 1 },
      },
    ],
  });

  const newNodebbCreateArenaTopic = nodebbMutations.useCreateArenaTopic({
    refetchQueries: [
      {
        query: nodebbQueries.arenaCategoryQuery,
        variables: { categoryId: Number(categoryId), page: 1 },
      },
    ],
  });

  if (config.enableNodeBB) return newNodebbCreateArenaTopic;
  else return createArenaTopic;
};

export const useArenaPostUpvote = (topicId: number) => {
  const upvotePost = myndlaMutations.useUpvotePostV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });
  const upvoteNodeBBPost = nodebbMutations.useUpvotePost();

  if (config.enableNodeBB) return upvoteNodeBBPost;
  else return upvotePost;
};

export const useArenaPostRemoveUpvote = (topicId: number) => {
  const removeUpvotePost = myndlaMutations.useRemoveUpvotePostV2({
    refetchQueries: [
      {
        query: myndlaQueries.arenaTopicByIdV2,
        variables: { topicId, page: 1, pageSize: 100 },
      },
    ],
  });
  const removeUpvoteNodeBBPost = nodebbMutations.useRemoveUpvotePost();

  if (config.enableNodeBB) return removeUpvoteNodeBBPost;
  else return removeUpvotePost;
};

export const useTemporaryArenaNotifications = (skip?: boolean) => {
  const { notifications, loading } = myndlaQueries.useArenaNotifications({
    skip: config.enableNodeBB || skip,
  });
  const { notifications: nodebbNotifications, loading: nodebbLoading } = nodebbQueries.useArenaNotifications({
    skip: !config.enableNodeBB || skip,
  });

  if (config.enableNodeBB) {
    const items: GQLArenaNotificationV2Fragment[] =
      nodebbNotifications?.map((notification) => {
        return {
          __typename: "ArenaNewPostNotificationV2",
          id: 123,
          topicId: notification.topicId,
          topicTitle: notification.topicTitle,
          notificationTime: notification.datetimeISO,
          isRead: notification.read,
          post: {
            __typename: "ArenaPostV2",
            id: notification.postId,
            contentAsHTML: notification.bodyShort,
            content: notification.bodyShort,
            created: notification.datetimeISO,
            topicId: notification.topicId,
            updated: notification.datetimeISO,
            upvotes: 0,
            upvoted: false,
            owner: {
              __typename: "ArenaUserV2",
              id: notification.user.id,
              username: notification.user.slug,
              displayName: notification.user.displayName,
              location: "",
              groups: [],
            },
            replies: [],
          },
        };
      }) ?? [];

    const notifications: GQLPaginatedNotificationsFragment = {
      __typename: "PaginatedArenaNewPostNotificationV2",
      totalCount: items.length,
      page: 1,
      pageSize: 100,
      items,
    };
    return {
      notifications,
      loading: nodebbLoading,
    };
  } else return { notifications, loading };
};
