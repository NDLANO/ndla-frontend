/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DialogTitle } from "@ark-ui/react";
import { FileCopyLine } from "@ndla/icons/action";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { LearningPathListItem } from "./LearningPathListItem";
import { sharedLearningPathLink } from "./utils";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyLearningpathFragment } from "../../../../graphqlTypes";

const GapWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const CopyLinkButton = styled(Button, {
  base: {
    justifyContent: "space-between",
    overflowWrap: "anywhere",
  },
});

const StyledDialogFooter = styled(DialogFooter, {
  base: {
    justifyContent: "flex-end",
    mobileWideDown: {
      flexDirection: "column",
      alignItems: "initial",
    },
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

interface Props {
  onClose: () => void;
  onCopyText: () => void;
  learningPath: GQLMyLearningpathFragment;
}

export const LearningPathShareDialogContent = ({ learningPath, onCopyText, onClose }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.learningpath.sharing.title", { title: learningPath.title })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <LearningPathListItem learningPath={learningPath} showMenu={false} />
        <Text>{t("myNdla.learningpath.sharing.description.shared")}</Text>
        <Text>{t("myNdla.learningpath.sharing.description.private")}</Text>
        <GapWrapper>
          <Text textStyle="label.medium" fontWeight="bold" asChild consumeCss>
            <span>{t("myNdla.learningpath.sharing.description.copy")}</span>
          </Text>
          <CopyLinkButton
            aria-label={t("myNdla.learningpath.sharing.link")}
            title={t("myNdla.learningpath.sharing.link")}
            variant="secondary"
            onClick={() => {
              onCopyText?.();
              toast.create({
                title: t("myNdla.learningpath.sharing.link"),
              });
            }}
          >
            {sharedLearningPathLink(learningPath.id)}
            <FileCopyLine />
          </CopyLinkButton>
        </GapWrapper>
      </StyledDialogBody>
      <StyledDialogFooter>
        <Button variant="primary" onClick={onClose}>
          {t("myNdla.learningpath.sharing.button.done")}
        </Button>
      </StyledDialogFooter>
    </DialogContent>
  );
};
