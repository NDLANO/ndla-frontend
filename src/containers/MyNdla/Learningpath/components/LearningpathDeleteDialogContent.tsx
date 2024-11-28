/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { LearningpathListItem } from "./LearningpathListItem";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLLearningpathFragment } from "../../../../graphqlTypes";

interface Props {
  onDelete: (path: number) => void;
  onClose: () => void;
  learningpath: GQLLearningpathFragment;
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
        <LearningpathListItem learningpath={learningpath} showMenu={false} />
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
