/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from 'date-fns';
import { nb, nn, enGB } from 'date-fns/locale';
import parse from 'html-react-parser';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { ReportOutlined } from '@ndla/icons/common';
import { Switch } from '@ndla/switch';
import { Text, Heading } from '@ndla/typography';
import { useSnack } from '@ndla/ui';
import { ArenaFormValues } from './ArenaForm';
import ArenaTextModal, { ArenaTextModalContent } from './ArenaTextModal';
import FlagPostModalContent from './FlagPostModalContent';
import { AuthContext } from '../../../../components/AuthenticationContext';
import { SKIP_TO_CONTENT_ID } from '../../../../constants';
import {
  GQLArenaPostFragment,
  GQLArenaTopicByIdQuery,
} from '../../../../graphqlTypes';
import {
  useDeletePost,
  useDeleteTopic,
  useReplyToTopic,
  useUpdatePost,
} from '../../arenaMutations';
import { arenaCategoryQuery, arenaTopicById } from '../../arenaQueries';
import DeleteModalContent from '../../components/DeleteModalContent';
import SettingsMenu, { MenuItemProps } from '../../components/SettingsMenu';
import UserProfileTag from '../../components/UserProfileTag';
import { capitalizeFirstLetter, toArena, toArenaCategory } from '../utils';

interface Props {
  onFollowChange: (value: boolean) => void;
  affiliation: string;
  post: GQLArenaPostFragment;
  topic: GQLArenaTopicByIdQuery['arenaTopic'];
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
}

const StyledCardContainer = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const StyledTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column-reverse;
  }
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
  padding: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    align-self: flex-end;
    margin-bottom: ${spacing.small};
  }
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledTimestamp = styled(Text)`
  align-self: center;
`;

const Locales = {
  nn: nn,
  nb: nb,
  en: enGB,
  se: nb,
};

const PostCard = ({
  topic,
  post,
  affiliation,
  onFollowChange,
  setFocusId,
}: Props) => {
  const {
    id: postId,
    topicId,
    isMainPost,
    timestamp,
    content,
    user: { displayName, username },
  } = post;

  const {
    t,
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const { addSnack } = useSnack();
  const { user } = useContext(AuthContext);
  const { replyToTopic } = useReplyToTopic({
    refetchQueries: [
      {
        query: arenaTopicById,
        variables: { topicId, page: 1 },
      },
    ],
  });
  const { updatePost } = useUpdatePost({
    refetchQueries: [
      {
        query: arenaTopicById,
        variables: { topicId, page: 1 },
      },
    ],
  });
  const { deletePost } = useDeletePost({
    refetchQueries: [
      {
        query: arenaTopicById,
        variables: { topicId, page: 1 },
      },
    ],
  });
  const { deleteTopic } = useDeleteTopic({
    refetchQueries: [
      {
        query: arenaCategoryQuery,
        variables: { categoryId: topic?.categoryId, page: 1 },
      },
    ],
  });

  const type = isMainPost ? 'topic' : 'post';

  const validPosts = useMemo(
    () => topic?.posts.filter(({ deleted }) => !deleted),
    [topic?.posts],
  );

  const deleteTopicCallback = useCallback(
    async (close: VoidFunction) => {
      await deleteTopic({ variables: { topicId } });
      close();
      addSnack({
        content: t('myNdla.arena.deleted.topic'),
        id: 'arenaTopicDeleted',
      });
      if (topic?.categoryId) {
        navigate(toArenaCategory(topic.categoryId));
      } else {
        navigate(toArena());
      }
    },
    [topicId, deleteTopic, navigate, topic?.categoryId, addSnack, t],
  );

  const deletePostCallback = useCallback(
    async (close: VoidFunction, skipAutoFocus: VoidFunction) => {
      await deletePost({ variables: { postId } });
      close();
      addSnack({
        content: t('myNdla.arena.deleted.post'),
        id: 'arenaPostDeleted',
      });
      const index = validPosts?.indexOf(post) ?? 0;
      const previousPostId = validPosts?.[index - 1]?.id;
      const nextPostId = validPosts?.[index + 1]?.id;
      setFocusId(nextPostId ?? previousPostId);
      skipAutoFocus();
    },
    [deletePost, postId, addSnack, t, setFocusId, validPosts, post],
  );

  const menu = useMemo(() => {
    // Regex replaces @ with -. Same method as in backend
    const isCorrectUser =
      user?.username.replace(
        /[^'"\s\-.*0-9\u00BF-\u1FFF\u2C00-\uD7FF\w]+/,
        '-',
      ) === username;

    const update: MenuItemProps = {
      icon: <Pencil />,
      text: t('myNdla.arena.posts.dropdownMenu.edit'),
      type: 'primary',
      isModal: true,
      modalContent: (close) => (
        <ArenaTextModalContent
          type={type}
          onClose={close}
          onSave={async (data) => {
            await updatePost({
              variables: {
                content: data.content ?? '',
                postId,
                title: isMainPost ? data.title : undefined,
              },
            });
            addSnack({
              content: t(`myNdla.arena.updated.${type}`),
              id: `arena${type}Updated`,
            });
          }}
          title={topic?.title}
          content={content}
        />
      ),
    };

    const deleteItem: MenuItemProps = {
      icon: <TrashCanOutline />,
      type: 'danger',
      text: t('myNdla.arena.posts.dropdownMenu.delete'),
      isModal: true,
      modalContent: (close, skipAutoFocus) => (
        <DeleteModalContent
          onClose={close}
          onDelete={async () => {
            isMainPost
              ? await deleteTopicCallback(close)
              : await deletePostCallback(close, skipAutoFocus);
          }}
          title={t(`myNdla.arena.deleteTitle.${type}`)}
          description={t(`myNdla.arena.description.${type}`)}
          removeText={t(`myNdla.arena.removeText.${type}`)}
        />
      ),
    };

    const report: MenuItemProps = {
      icon: <ReportOutlined />,
      text: t('myNdla.arena.posts.dropdownMenu.report'),
      type: 'primary',
      isModal: true,
      modality: false,
      modalContent: (close) => (
        <FlagPostModalContent id={postId} onClose={close} />
      ),
    };

    return (
      <SettingsMenu
        menuItems={isCorrectUser ? [update, deleteItem] : [report]}
        modalHeader={t('myNdla.tools')}
      />
    );
  }, [
    t,
    user,
    type,
    postId,
    content,
    addSnack,
    username,
    updatePost,
    isMainPost,
    topic?.title,
    deletePostCallback,
    deleteTopicCallback,
  ]);

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      const newReply = await replyToTopic({
        variables: { topicId, content: data.content ?? '' },
      });
      setFocusId(newReply.data?.replyToTopic.id);
    },
    [replyToTopic, topicId, setFocusId],
  );

  return (
    <StyledCardContainer id={`post-${postId}`}>
      <StyledTopContainer>
        <UserProfileTag
          displayName={displayName}
          username={username}
          affiliation={affiliation}
        />
        {isMainPost && (
          <StyledSwitch
            onChange={onFollowChange}
            checked={!!topic?.isFollowing}
            label={t('myNdla.arena.posts.notify')}
            id={t('myNdla.arena.posts.notify')}
          />
        )}
      </StyledTopContainer>
      <StyledContentContainer>
        {isMainPost && (
          <Heading
            element="h1"
            id={SKIP_TO_CONTENT_ID}
            headingStyle="h4"
            margin="none"
          >
            {topic?.title}
          </Heading>
        )}
        <Text element="div" textStyle="content-alt" margin="none">
          {parse(content)}
        </Text>
      </StyledContentContainer>
      <BottomContainer>
        {!isMainPost && (
          <StyledTimestamp element="p" textStyle="content-alt" margin="none">
            {`${capitalizeFirstLetter(
              formatDistanceStrict(Date.parse(timestamp), Date.now(), {
                addSuffix: true,
                locale: Locales[language],
                roundingMethod: 'floor',
              }),
            )}`}
          </StyledTimestamp>
        )}
        {menu}
        {isMainPost && <ArenaTextModal type="post" onSave={createReply} />}
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
