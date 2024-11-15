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
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { LearningPathListItem } from "./LearningPathListItem";
import { sharedLearningPathLink } from "./utils";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLLearningpathFragmentFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";

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
    justifyContent: "space-between",
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
  learningPath: GQLLearningpathFragmentFragment;
}

export const LearningPathShareDialogContent = ({ learningPath, onCopyText, onClose }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myndla.learningpath.sharing.title", { title: learningPath.title })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <LearningPathListItem learningPath={learningPath} showMenu={false} />
        <Text>{t("myndla.learningpath.sharing.shared.description")}</Text>
        <Text>{t("myndla.learningpath.sharing.private.description")}</Text>
        <GapWrapper>
          <Text textStyle="label.medium" fontWeight="bold" asChild consumeCss>
            <span>{t("myNdla.learningpath.sharing.description.copy")}</span>
          </Text>
          <CopyLinkButton
            aria-label={t("myNdla.learningpath.sharing.shareLink")}
            title={t("myNdla.learningpath.sharing.shareLink")}
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
        <SafeLinkButton to={routes.learningPath(learningPath.id)} variant="tertiary">
          {t("myNdla.learningpath.sharing.button.preview")}
        </SafeLinkButton>
        <Button
          variant="primary"
          onClick={() => {
            onClose();
          }}
        >
          {t("finished")}
        </Button>
      </StyledDialogFooter>
    </DialogContent>
  );
};
