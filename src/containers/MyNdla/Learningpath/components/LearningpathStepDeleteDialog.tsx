/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@ndla/primitives";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";

interface Props {
  onDelete: (close: VoidFunction) => Promise<void>;
}
export const LearningpathStepDeleteDialog = ({ onDelete }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const deleteAndClose = async () => {
    await onDelete(() => setOpen(false));
  };

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button variant="danger">{t("myNdla.learningpath.form.delete")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("myNdla.learningpath.form.deleteStep")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>{t("myNdla.learningpath.form.deleteBody")}</DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button variant="danger" onClick={deleteAndClose}>
            {t("myNdla.learningpath.form.deleteStep")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
