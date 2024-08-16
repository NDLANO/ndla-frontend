/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, misc, mq, spacing } from "@ndla/core";
import { FileCopyLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import FolderAndResourceCount from "./FolderAndResourceCount";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import { GQLFolder } from "../../../../graphqlTypes";
import { routes } from "../../../../routeHelpers";
import { sharedFolderLink } from "../util";

const GapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const FolderName = styled.span`
  ${fonts.size.text.metaText.medium};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: ${spacing.small};
  align-items: center;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
`;

const CopyLinkButton = styled(Button)`
  justify-content: space-between;
`;

const CopyLinkHeader = styled.span`
  ${fonts.size.text.metaText.medium};
  font-weight: ${fonts.weight.semibold};
`;

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
    gap: ${spacing.xsmall};
  }
`;

interface BaseProps {
  folder: GQLFolder;
  onCopyText?: () => void;
}

interface FolderShareModalContentProps extends BaseProps {
  onClose: () => void;
}

interface FolderShareModalProps extends BaseProps {
  children: ReactNode;
}

export const FolderShareModalContent = ({ onClose, folder, onCopyText }: FolderShareModalContentProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.folder.sharing.header.shared")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <GapWrapper>
          <FolderName aria-label={folder.name}>{folder.name}</FolderName>
          <FolderAndResourceCount
            selectedFolder={folder}
            hasSelectedFolder={!!folder}
            folders={folder.subfolders}
            folderData={folder.subfolders}
            loading={false}
          />
        </GapWrapper>
        {t("myNdla.folder.sharing.description.private")}
        <div>{t("myNdla.folder.sharing.description.shared")}</div>
        <GapWrapper>
          <CopyLinkHeader>{t("myNdla.folder.sharing.description.copy")}</CopyLinkHeader>
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
        <StyledButtonRow>
          <SafeLinkButton to={routes.folder(folder.id)} variant="secondary">
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
        </StyledButtonRow>
      </DialogBody>
    </DialogContent>
  );
};

const FolderShareModal = ({ children, folder, onCopyText }: FolderShareModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <FolderShareModalContent onClose={() => setOpen(false)} folder={folder} onCopyText={onCopyText} />
    </DialogRoot>
  );
};

export default FolderShareModal;
