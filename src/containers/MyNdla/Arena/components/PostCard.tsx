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
  useRef,
  useState,
} from 'react';
import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { ReportOutlined } from '@ndla/icons/common';
import { Switch } from '@ndla/switch';
import { Text, Heading } from '@ndla/typography';
import { useSnack } from '@ndla/ui';
import ArenaForm, { ArenaFormValues, ArenaFormWrapper } from './ArenaForm';
import FlagPostModalContent from './FlagPostModalContent';
import { AuthContext } from '../../../../components/AuthenticationContext';
import { SKIP_TO_CONTENT_ID } from '../../../../constants';
import {
  GQLArenaPostFragment,
  GQLArenaTopicByIdQuery,
} from '../../../../graphqlTypes';
import { formatDateTime } from '../../../../util/formatDate';
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
  post: GQLArenaPostFragment;
  topic: GQLArenaTopicByIdQuery['arenaTopic'];
  setFocusId: Dispatch<SetStateAction<number | undefined>>;
}

const PostWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.large};
`;

const StyledArenaFormWrapper = styled(ArenaFormWrapper)`
  ${mq.range({ from: breakpoints.tablet })} {
    margin-left: ${spacing.xlarge};
  }
`;

const PostCardWrapper = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
  border: 2px solid transparent;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    align-self: flex-end;
    margin-bottom: ${spacing.small};
  }
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: ${colors.brand.dark};
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const FlexLine = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
`;

const TimestampText = styled(Text)`
  align-self: center;
`;

const StyledContent = styled(Text)`
  word-break: break-word;
`;

const Locales = {
  nn: nn,
  nb: nb,
  en: enGB,
  se: nb,
};

const PostCard = ({ topic, post, onFollowChange, setFocusId }: Props) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const {
    id: postId,
    topicId,
    isMainPost,
    timestamp,
    content,
    user: { displayName, username, location },
  } = post;
  const replyToRef = useRef<HTMLButtonElement | null>(null);

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
      onClick: () => setIsEditing(true),
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
    username,
    isMainPost,
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

  const timeDistance = formatDistanceStrict(Date.parse(timestamp), Date.now(), {
    addSuffix: true,
    locale: Locales[language],
    roundingMethod: 'floor',
  });

  const postTime = useMemo(
    () => (
      <TimestampText element="span" textStyle="content-alt" margin="none">
        <span title={formatDateTime(timestamp, language)}>
          {`${capitalizeFirstLetter(timeDistance)}`}
        </span>
      </TimestampText>
    ),
    [timestamp, language, timeDistance],
  );

  const options = useMemo(
    () =>
      isMainPost ? (
        <>
          <FlexLine>
            {menu}
            {postTime}
          </FlexLine>
          <ButtonV2
            ref={replyToRef}
            onClick={() => setIsReplying(true)}
            disabled={isReplying}
          >
            {t('myNdla.arena.new.post')}
          </ButtonV2>
        </>
      ) : (
        <>
          {postTime}
          {menu}
        </>
      ),
    [menu, isMainPost, t, postTime, replyToRef, setIsReplying, isReplying],
  );

  const followSwitch = useMemo(
    () =>
      isMainPost ? (
        <StyledSwitch
          onChange={onFollowChange}
          checked={!!topic?.isFollowing}
          label={t('myNdla.arena.posts.notify')}
          id={t('myNdla.arena.posts.notify')}
        />
      ) : null,
    [onFollowChange, topic?.isFollowing, isMainPost, t],
  );

  const profileTag = useMemo(
    () => (
      <UserProfileTag
        displayName={displayName}
        username={username}
        affiliation={location ?? ''}
      />
    ),
    [displayName, username, location],
  );

  const header = useMemo(
    () =>
      isMobile ? (
        <>
          {followSwitch}
          {profileTag}
        </>
      ) : (
        <>
          {profileTag}
          {followSwitch}
        </>
      ),
    [followSwitch, profileTag],
  );

  return (
    <PostWrapper>
      <PostCardWrapper id={`post-${postId}`}>
        {isEditing ? (
          <ArenaForm
            id={postId}
            type={type}
            initialTitle={topic?.title}
            initialContent={post.content}
            onAbort={() => setIsEditing(false)}
            onSave={async (values) => {
              await updatePost({
                variables: { postId, content: values.content ?? '' },
              });
              setIsEditing(false);
            }}
          />
        ) : (
          <>
            <PostHeader>{header}</PostHeader>
            <ContentWrapper>
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
              <StyledContent
                element="div"
                textStyle="content-alt"
                margin="none"
              >
                {parse(content)}
              </StyledContent>
            </ContentWrapper>
            <FlexLine>{options}</FlexLine>
          </>
        )}
      </PostCardWrapper>
      {isReplying && (
        <StyledArenaFormWrapper>
          <ArenaForm
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
    </PostWrapper>
  );
};

export default PostCard;
