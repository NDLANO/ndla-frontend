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
  DialogFooter,
} from "@ndla/primitives";
import { DialogCloseButton } from "../DialogCloseButton";

interface Props {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
  onClose?: (e?: Event) => void;
}

export const DeleteModalContent = ({ onDelete, title, description, removeText }: Props) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Text>{description}</Text>
      </DialogBody>
      <DialogFooter>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("cancel")}</Button>
        </DialogCloseTrigger>
        <Button variant="danger" onClick={onDelete}>
          {removeText}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
