/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { History, Blocker, Transition } from "history";
import { useContext, useEffect, useState } from "react";
import { FormState } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { UNSAFE_NavigationContext, useNavigate, Location } from "react-router-dom";
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
import { supportedLanguages } from "../../../../i18n";
import { FormValues } from "../types";

// TODO: Remove when upgrading react-router
// V6 has not added useBlocker hook yet. Source taken from react-router. Same logic used in editorial frontend
const useBlocker = (blocker: Blocker, when = true): void => {
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (!when) return;
    const unblock = navigator.block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });
    return unblock;
  }, [navigator, blocker, when]);
};

interface Props {
  formState: FormState<FormValues>;
  onContinue?: () => void;
  onAbort?: () => void;
  isBlocking: boolean;
}

export const AlertDialog = ({ formState, onContinue, onAbort, isBlocking }: Props) => {
  const [open, setOpen] = useState<boolean>(isBlocking);
  const [discardChanges, setDiscardChanges] = useState(false);
  const [nextLocation, setNextLocation] = useState<Location | undefined>(undefined);
  const { t } = useTranslation();

  const navigate = useNavigate();

  const shouldBlock = !(!formState.isDirty || formState.isSubmitting || discardChanges);
  const onCancel = () => {
    setNextLocation(undefined);
    setOpen(false);
    onAbort?.();
  };

  const onWillContinue = () => {
    setDiscardChanges(true);
    setOpen(false);
    onContinue?.();
  };

  useBlocker((transition) => {
    if (shouldBlock) {
      // transition does not respect basename. Filter out basename until it is fixed.
      const pathRegex = new RegExp(supportedLanguages.map((l) => `/${l}/`).join("|"));
      const pathname = transition.location.pathname.replace(pathRegex, "/");
      setOpen(true);
      setNextLocation({ ...transition.location, pathname });
    } else {
      setDiscardChanges(false);
    }
  }, shouldBlock);

  useEffect(() => {
    if (!shouldBlock && nextLocation) {
      navigate(nextLocation);
    }
  }, [shouldBlock, nextLocation, navigate]);

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      onInteractOutside={onCancel}
      onEscapeKeyDown={onCancel}
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
