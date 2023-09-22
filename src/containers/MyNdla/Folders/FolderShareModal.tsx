/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ModalContent,
  Modal,
  ModalTrigger,
} from '@ndla/modal';
import styled from '@emotion/styled';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { Copy, TrashCanOutline } from '@ndla/icons/action';
import { SafeLinkButton } from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { useSnack } from '@ndla/ui';
import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { GQLFolder } from '../../../graphqlTypes';
import FolderAndResourceCount from './FolderAndResourceCount';
import { toFolderPreview } from '../../../routeHelpers';
import { previewLink } from './util';
import IsMobileContext from '../../../IsMobileContext';

const FolderName = styled.span`
  ${fonts.sizes('18px', '24px')};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: ${spacing.small};
  align-items: center;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-flow: column;
  gap: ${spacing.nsmall};
`;

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
  font-style: italic;
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
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
`;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: ${spacing.xsmall};
  margin-top: ${spacing.small};
  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
    margin-top: ${spacing.xsmall};
  }
`;

const StyledSpacing = styled.div`
  flex-grow: 1;
`;

interface BaseProps {
  folder: GQLFolder;
  type: 'shared' | 'private' | 'unShare';
  onUpdateStatus?: (close: VoidFunction) => void;
  onCopyText?: () => void;
}

interface FolderShareModalContentProps extends BaseProps {
  onClose: () => void;
}

interface FolderShareModalProps extends BaseProps {
  children: ReactNode;
}

export const FolderShareModalContent = ({
  onClose,
  type,
  folder,
  onUpdateStatus,
  onCopyText,
}: FolderShareModalContentProps) => {
  const { t } = useTranslation();
  const { addSnack } = useSnack();
  const isMobile = useContext(IsMobileContext);
  const cancelButton = useMemo(
    () =>
      !(type === 'shared' && isMobile) ? (
        <ButtonV2 shape="pill" onClick={onClose} variant="outline">
          {t('cancel')}
        </ButtonV2>
      ) : null,
    [isMobile, onClose, t, type],
  );

  const onUpdate = useCallback(() => {
    onUpdateStatus?.(onClose);
  }, [onClose, onUpdateStatus]);

  const modalButton = useMemo(() => {
    if (type === 'shared') {
      return (
        <SafeLinkButton
          shape="pill"
          to={toFolderPreview(folder.id)}
          colorTheme="light"
        >
          {t('myNdla.folder.sharing.button.preview')}
        </SafeLinkButton>
      );
    } else {
      return (
        <ButtonV2 shape="pill" onClick={onUpdate} colorTheme="light">
          {t(
            `myNdla.folder.sharing.button.${
              type === 'private' ? 'share' : 'unShare'
            }`,
          )}
        </ButtonV2>
      );
    }
  }, [folder.id, onUpdate, t, type]);

  const unShareButton = useMemo(
    () =>
      type === 'shared' ? (
        <ButtonV2
          shape="pill"
          variant={isMobile ? 'outline' : 'ghost'}
          colorTheme="danger"
          onClick={onUpdate}
        >
          {t('myNdla.folder.sharing.button.unShare')}
          {!isMobile && <TrashCanOutline />}
        </ButtonV2>
      ) : null,
    [isMobile, onUpdate, t, type],
  );

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t(`myNdla.folder.sharing.header.${type}`)}</ModalTitle>
        <ModalCloseButton title={t('myNdla.folder.closeModal')} />
      </ModalHeader>
      <StyledModalBody>
        <FolderName aria-label={folder.name}>{folder.name}</FolderName>
        <FolderAndResourceCount
          selectedFolder={folder}
          hasSelectedFolder={!!folder}
          folders={folder.subfolders}
          folderData={folder.subfolders}
          loading={false}
        />
        {type === 'shared' && (
          <div>
            <CopyLinkHeader>
              {t('myNdla.folder.sharing.description.copy')}
            </CopyLinkHeader>
            <Tooltip tooltip={t('myNdla.folder.sharing.button.shareLink')}>
              <CopyLinkButton
                aria-label={`${previewLink(folder.id)}`}
                variant="stripped"
                onClick={() => {
                  onCopyText?.();
                  addSnack({
                    id: 'shareLink',
                    content: t('myNdla.folder.sharing.link'),
                  });
                }}
              >
                <span>{previewLink(folder.id)}</span>
                <div>
                  <Copy />
                </div>
              </CopyLinkButton>
            </Tooltip>
          </div>
        )}
        {t(`myNdla.folder.sharing.description.${type}`)}
        <StyledButtonRow>
          {isMobile ? (
            <>
              {modalButton}
              {unShareButton}
              {cancelButton}
            </>
          ) : (
            <>
              {unShareButton}
              <StyledSpacing />
              {cancelButton}
              {modalButton}
            </>
          )}
        </StyledButtonRow>
      </StyledModalBody>
    </ModalContent>
  );
};

const FolderShareModal = ({
  children,
  type,
  folder,
  onUpdateStatus,
  onCopyText,
}: FolderShareModalProps) => {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>{children}</ModalTrigger>
      <FolderShareModalContent
        onClose={close}
        type={type}
        folder={folder}
        onUpdateStatus={onUpdateStatus}
        onCopyText={onCopyText}
      />
    </Modal>
  );
};

export default FolderShareModal;
