/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  Text,
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../../components/DialogCloseButton";

interface Props {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
  onClose?: (e?: Event) => void;
}

const StyledButtonRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "xsmall",
  },
});

const DeleteModalContent = ({ onDelete, title, description, removeText }: Props) => {
  const { t } = useTranslation();
  return (
    // TODO: We used to call onAutoFocusClose or whatever here.
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
          <Button variant="danger" onClick={onDelete}>
            {removeText}
          </Button>
        </StyledButtonRow>
      </DialogBody>
    </DialogContent>
  );
};

export default DeleteModalContent;
