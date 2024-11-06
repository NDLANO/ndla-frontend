/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningPathListItem } from "./LearningPathListItem";
import { GQLLearningpath } from "../../../../graphqlTypes";
import { DialogCloseButton } from "../../../components/DialogCloseButton";

const StyledDialogFooter = styled(DialogFooter, {
  base: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
});

interface Props {
  onDelete: (path: GQLLearningpath) => void;
  onClose: () => void;
  learningPath: GQLLearningpath;
}

export const LearningPathDeleteDialogContent = ({ onDelete, onClose, learningPath }: Props) => {
  const { t } = useTranslation();
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myndla.learningpath.title", { title: learningPath.title })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <LearningPathListItem learningPath={learningPath} showMenu={false} />
        <Text>{t("myNdla.learningPath.delete.body")}</Text>
      </DialogBody>
      <StyledDialogFooter>
        <Button onClick={(_e) => onClose()}>{t("cancel")}</Button>
        <Button onClick={() => onDelete(learningPath)} variant="danger">
          {t("myndla.learningpath.delete.button")}
        </Button>
      </StyledDialogFooter>
    </DialogContent>
  );
};
