/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { Text } from "@ndla/typography";

interface Props {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
  onClose?: (e?: Event) => void;
}

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const DeleteModalContent = ({ onDelete, onClose, title, description, removeText }: Props) => {
  const { t } = useTranslation();
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
            <Button variant="secondary">{t("cancel")}</Button>
          </ModalCloseButton>
          <Button variant="danger" onClick={onDelete}>
            {removeText}
          </Button>
        </StyledButtonRow>
      </ModalBody>
    </ModalContent>
  );
};

export default DeleteModalContent;
