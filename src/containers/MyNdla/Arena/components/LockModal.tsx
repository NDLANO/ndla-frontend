/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { GQLArenaPostV2Fragment, GQLArenaTopicV2Fragment } from "../../../../graphqlTypes";
import { useUpdateTopicV2 } from "../../arenaMutations";

interface Props {
  topic: GQLArenaTopicV2Fragment | undefined;
  post: GQLArenaPostV2Fragment | undefined;
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

  const onLock = () => {
    if (!topic || !post) return;
    updateTopic.updateTopic({
      variables: {
        topicId: topic.id,
        title: topic.title,
        content: post.content,
        isLocked: !isLocked,
      },
    });
  };

  return (
    <ModalContent onCloseAutoFocus={onClose}>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Text>{description}</Text>
        <StyledButtonRow>
          <ModalCloseButton>
            <ButtonV2 variant="outline">{t("cancel")}</ButtonV2>
          </ModalCloseButton>
          <ButtonV2 colorTheme="danger" variant="outline" onClick={onLock}>
            {lockText}
          </ButtonV2>
        </StyledButtonRow>
      </ModalBody>
    </ModalContent>
  );
};

export default LockModal;
