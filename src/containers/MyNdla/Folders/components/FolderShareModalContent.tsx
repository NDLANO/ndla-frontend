/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FileCopyLine } from "@ndla/icons/action";
import { Button, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { Folder } from "../../../../components/MyNdla/Folder";
import { useToast } from "../../../../components/ToastContext";
import { GQLFolder } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { getTotalCountForFolder } from "../../../../util/folderHelpers";
import { sharedFolderLink } from "../util";

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

interface BaseProps {
  folder: GQLFolder;
  onCopyText?: () => void;
}

interface FolderShareModalContentProps extends BaseProps {
  onClose: () => void;
}

const FolderShareModalContent = ({ onClose, folder, onCopyText }: FolderShareModalContentProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.folder.sharing.header.shared")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <StyledDialogBody>
        <Folder
          folder={folder}
          context="standalone"
          variant="subtle"
          nonInteractive
          foldersCount={getTotalCountForFolder(folder)}
        />
        <Text textStyle="body.large">{t("myNdla.folder.sharing.description.private")}</Text>
        <Text textStyle="body.large">{t("myNdla.folder.sharing.description.shared")}</Text>
        <GapWrapper>
          <Text textStyle="label.medium" fontWeight="bold" asChild consumeCss>
            <span>{t("myNdla.folder.sharing.description.copy")}</span>
          </Text>
          <CopyLinkButton
            aria-label={t("myNdla.folder.sharing.button.shareLink")}
            title={t("myNdla.folder.sharing.button.shareLink")}
            variant="secondary"
            onClick={() => {
              onCopyText?.();
              toast.create({
                title: t("myNdla.folder.sharing.link"),
              });
            }}
          >
            {sharedFolderLink(folder.id)}
            <FileCopyLine />
          </CopyLinkButton>
        </GapWrapper>
      </StyledDialogBody>
      <StyledDialogFooter>
        <SafeLinkButton to={routes.folder(folder.id)} variant="tertiary">
          {t("myNdla.folder.sharing.button.preview")}
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

export default FolderShareModalContent;
