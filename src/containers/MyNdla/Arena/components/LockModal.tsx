/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Button, DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogTitle } from "@ndla/primitives";
import { Text } from "@ndla/typography";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLArenaPostV2Fragment, GQLArenaTopicV2Fragment } from "../../../../graphqlTypes";
import { useUpdateTopicV2 } from "../../arenaMutations";

interface Props {
  topic: GQLArenaTopicV2Fragment | undefined;
  post: Omit<GQLArenaPostV2Fragment, "replies"> | GQLArenaPostV2Fragment | undefined;
  onClose?: (e?: Event) => void;
}

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const LockModal = ({ topic, post, onClose }: Props) => {
  const { t } = useTranslation();
  const updateTopic = useUpdateTopicV2({});
  const isLocked = topic?.isLocked;
  const title = isLocked ? t("myNdla.arena.topic.unlock") : t("myNdla.arena.topic.locked");
  const lockText = isLocked ? t("myNdla.arena.topic.unlock") : t("myNdla.arena.topic.locked");
  const description = isLocked ? t("myNdla.arena.topic.unlockDescription") : t("myNdla.arena.topic.lockDescription");

  const onLock = async () => {
    if (!topic || !post) return;
    await updateTopic.updateTopic({
      variables: {
        topicId: topic.id,
        title: topic.title,
        content: post.content,
        isLocked: !isLocked,
      },
    });
    onClose?.();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Text>{description}</Text>
        <StyledButtonRow>
          <DialogCloseTrigger asChild>
            <Button variant="secondary">{t("cancel")}</Button>
          </DialogCloseTrigger>
          <Button variant="danger" onClick={onLock}>
            {lockText}
          </Button>
        </StyledButtonRow>
      </DialogBody>
    </DialogContent>
  );
};

export default LockModal;
