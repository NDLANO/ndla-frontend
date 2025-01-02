/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FileCopyLine } from "@ndla/icons";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathListItem } from "./LearningpathListItem";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { sharedLearningpathLink } from "../utils";

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

const StyledDialogBody = styled(DialogBody, {
  base: {
    gap: "medium",
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

interface Props {
  onClose: () => void;
  onCopyText: () => void;
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const LearningpathShareDialogContent = ({ learningpath, onCopyText, onClose }: Props) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.learningpath.sharing.title", { title: learningpath.title })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <LearningpathListItem learningpath={learningpath} showMenu={false} />
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
                title: t("myNdla.learningpath.sharing.copied"),
              });
            }}
          >
            {sharedLearningpathLink(learningpath.id)}
            <FileCopyLine />
          </CopyLinkButton>
        </GapWrapper>
      </StyledDialogBody>
      <StyledDialogFooter>
        <SafeLinkButton variant="tertiary" to={routes.myNdla.learningpathPreview(learningpath.id)}>
          {t("myNdla.learningpath.sharing.button.preview")}
        </SafeLinkButton>
        <Button variant="primary" onClick={onClose}>
          {t("myNdla.learningpath.sharing.button.done")}
        </Button>
      </StyledDialogFooter>
    </DialogContent>
  );
};
