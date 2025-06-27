/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useBlocker } from "react-router-dom";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  Text,
} from "@ndla/primitives";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";

interface Props {
  onContinue?: () => void;
}

export const AlertDialog = ({ onContinue }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { formState } = useFormContext();
  const { t } = useTranslation();
  const blocker = useBlocker(formState.isDirty || formState.isSubmitting);

  const onWillContinue = () => {
    onContinue?.();
    blocker.proceed?.();
  };

  const onCancel = () => {
    blocker.reset?.();
  };

  useEffect(() => {
    setOpen(blocker.state === "blocked");
  }, [blocker]);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      closeOnEscape
      closeOnInteractOutside
      onExitComplete={onCancel}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(`myNdla.learningpath.alert.title`)}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text textStyle="body.large">{t(`myNdla.learningpath.alert.content`)}</Text>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={onCancel}>
            {t(`myNdla.learningpath.alert.cancel`)}
          </Button>
          <Button variant="danger" onClick={onWillContinue}>
            {t(`myNdla.learningpath.alert.continue`)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
