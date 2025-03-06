/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { LearningpathItem } from "./LearningpathItem";
import { LearningpathShareLink } from "./LearningpathShareLink";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { GQLMyNdlaLearningpathFragment } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";

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
  learningpath: GQLMyNdlaLearningpathFragment;
}

export const LearningpathShareDialogContent = ({ learningpath, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.learningpath.sharing.title", { title: learningpath.title })}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <LearningpathItem learningpath={learningpath} showMenu={false} />
        <LearningpathShareLink learningpath={learningpath} />
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
