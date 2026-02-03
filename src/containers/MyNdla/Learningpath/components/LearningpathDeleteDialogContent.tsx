/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { LearningpathItem } from "./LearningpathItem";

interface Props {
  onDelete: (path: number) => void;
  onClose: () => void;
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const LearningpathDeleteDialogContent = ({ onDelete, onClose, learningpath }: Props) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.learningpath.delete.title")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <LearningpathItem learningpath={learningpath} />
        <Text>{t("myNdla.learningpath.delete.body")}</Text>
      </DialogBody>
      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button onClick={() => onDelete(learningpath.id)} variant="danger">
          {t("myNdla.learningpath.delete.button")}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
