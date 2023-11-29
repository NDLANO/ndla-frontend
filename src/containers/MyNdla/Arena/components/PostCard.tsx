/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import styled from '@emotion/styled';
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { ReportOutlined } from '@ndla/icons/common';
import { Switch } from '@ndla/switch';
import { Text, Heading } from '@ndla/typography';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { nb, nn, enGB } from 'date-fns/locale';
import { formatDistanceStrict } from 'date-fns';
import UserProfileTag from '../../components/UserProfileTag';
import SettingsMenu from '../../components/SettingsMenu';
import ArenaTextModal, { ArenaTextModalContent } from './ArenaTextModal';
import { ArenaFormValues } from './ArenaForm';
import {
  useDeletePost,
  useDeleteTopic,
  useReplyToTopic,
  useUpdatePost,
} from '../../arenaQueries';
import DeleteModalContent from '../../components/DeleteModalContent';

interface Props {
  id: number;
  timestamp: string;
  isMainPost: boolean;
  title: string;
  content: string;
  notify: boolean;
  displayName: string;
  username: string;
  affiliation: string;
  topicId: number;
  categoryId?: number;
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

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const PostCard = ({
  id,
  title,
  content,
  timestamp,
  isMainPost,
  displayName,
  username,
  affiliation,
  topicId,
  categoryId,
}: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { replyToTopic } = useReplyToTopic(topicId);
  const { updatePost } = useUpdatePost(topicId);
  const { deletePost } = useDeletePost(topicId);
  const { deleteTopic } = useDeleteTopic();
  const navigate = useNavigate();

  const now = useMemo(() => new Date(), []);

  const type = isMainPost ? 'topic' : 'post';

  const deleteTopicCallback = useCallback(
    async (close: VoidFunction) => {
      await deleteTopic({ variables: { topicId } });
      close();
      navigate(`/minndla/category/${categoryId}`);
    },
    [topicId, deleteTopic, navigate, categoryId],
  );

  const deletePostCallback = useCallback(
    async (close: VoidFunction) => {
      await deletePost({ variables: { postId: id } });
      close();
    },
    [deletePost, id],
  );

  const menu = useMemo(
    () => (
      <SettingsMenu
        menuItems={[
          {
            icon: <ReportOutlined />,
            text: t('myNdla.arena.posts.dropdownMenu.report'),
            type: 'primary',
          },
          {
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
                      content: data.content!,
                      postId: id,
                      title: isMainPost ? data.title : undefined,
                    },
                  });
                  close();
                }}
                title={title}
                content={content}
              />
            ),
          },
          {
            icon: <TrashCanOutline />,
            type: 'danger',
            text: t('myNdla.arena.posts.dropdownMenu.delete'),
            isModal: true,
            modalContent: (close) => (
              <DeleteModalContent
                onClose={close}
                onDelete={async () => {
                  isMainPost
                    ? await deleteTopicCallback(close)
                    : await deletePostCallback(close);
                }}
                title={t(`myNdla.arena.deleteTitle`, { type })}
                description={t(`MyNdla.arena.description`, { type })}
                removeText={t(`myNdla.arena.removeText`, { type })}
              />
            ),
          },
        ]}
      />
    ),
    [
      t,
      id,
      type,
      content,
      title,
      updatePost,
      isMainPost,
      deletePostCallback,
      deleteTopicCallback,
    ],
  );

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      await replyToTopic({
        variables: { topicId, content: data.content ?? '' },
      });
    },
    [replyToTopic, topicId],
  );

  return (
    <StyledCardContainer key={id}>
      <StyledTopContainer>
        <UserProfileTag
          displayName={displayName}
          username={username}
          affiliation={affiliation}
        />
        {isMainPost && (
          <StyledSwitch
            onChange={() => {}}
            checked={false}
            label={t('myNdla.arena.posts.notify')}
            id={t('myNdla.arena.posts.notify')}
          />
        )}
      </StyledTopContainer>
      <StyledContentContainer>
        {isMainPost && (
          <Heading element="h4" headingStyle="h4" margin="none">
            {title}
          </Heading>
        )}
        <Text element="p" textStyle="content-alt" margin="none">
          {parse(content ?? '')}
        </Text>
      </StyledContentContainer>
      <BottomContainer>
        {!isMainPost && (
          <StyledTimestamp element="p" textStyle="content-alt" margin="none">
            {`${capitalizeFirstLetter(
              formatDistanceStrict(Date.parse(timestamp), now, {
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
