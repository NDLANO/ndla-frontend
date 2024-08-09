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
import { ButtonV2 } from "@ndla/button";
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
import { Tooltip } from "@ndla/tooltip";
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

// TODO: this should be IconButton ?
const CopyLinkButton = styled(ButtonV2)`
  padding: ${spacing.small};
  color: ${colors.text.primary};
  background: ${colors.brand.greyLightest};
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
  display: flex;
  justify-content: left;
  align-items: center;
  vertical-align: middle;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  justify-content: space-between;
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &:hover,
  &:active,
  &:disabled,
  &:focus-visible {
    background-color: ${colors.brand.greyLightest};
    color: ${colors.text.primary};
    border: 1px solid ${colors.brand.neutral7};
    box-shadow: 1px 1px 6px 2px rgba(9, 55, 101, 0.08);
    transition-duration: 0.2s;
  }
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
  setRef?: () => void;
}

interface FolderShareModalContentProps extends BaseProps {
  onClose: () => void;
}

interface FolderShareModalProps extends BaseProps {
  children: ReactNode;
}

export const FolderShareModalContent = ({ onClose, folder, onCopyText, setRef }: FolderShareModalContentProps) => {
  const { t } = useTranslation();
  const toast = useToast();

  return (
    // TODO: There used to be a onCloseAutoFocus here. It used to do setRef
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
          <Tooltip tooltip={t("myNdla.folder.sharing.button.shareLink")}>
            <CopyLinkButton
              aria-label={sharedFolderLink(folder.id)}
              variant="stripped"
              onClick={() => {
                onCopyText?.();
                toast.create({
                  title: t("myNdla.folder.sharing.link"),
                });
              }}
            >
              <span>{sharedFolderLink(folder.id)}</span>
              <div>
                <FileCopyLine />
              </div>
            </CopyLinkButton>
          </Tooltip>
        </GapWrapper>
        <StyledButtonRow>
          <SafeLinkButton to={routes.folder(folder.id)} variant="secondary">
            {t("myNdla.folder.sharing.button.preview")}
          </SafeLinkButton>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              setRef?.();
            }}
          >
            {t("finished")}
          </Button>
        </StyledButtonRow>
      </DialogBody>
    </DialogContent>
  );
};

const FolderShareModal = ({ children, folder, onCopyText, setRef }: FolderShareModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <FolderShareModalContent onClose={() => setOpen(false)} folder={folder} onCopyText={onCopyText} setRef={setRef} />
    </DialogRoot>
  );
};

export default FolderShareModal;
