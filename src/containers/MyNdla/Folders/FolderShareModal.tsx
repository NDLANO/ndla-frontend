/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { ModalBody, ModalCloseButton, ModalHeader, ModalV2 } from '@ndla/modal';
import styled from '@emotion/styled';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { TrashCanOutline } from '@ndla/icons/action';
import { SafeLinkButton } from '@ndla/safelink';
import { useSnack } from '@ndla/ui';
import { useContext, useMemo } from 'react';
import { GQLFolder } from '../../../graphqlTypes';
import FolderAndResourceCount from './FolderAndResourceCount';
import { toFolderPreview } from '../../../routeHelpers';
import { previewLink } from './util';
import IsMobileContext from '../../../IsMobileContext';

const Title = styled.h1`
  margin-bottom: 0;
`;

const FolderTitle = styled.span`
  ${fonts.sizes('18px', '24px')};
  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.semibold};
  padding: ${spacing.small};
  align-items: center;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
`;

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0 0 ${spacing.small} 0;
  }
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

  &:hover,
  &:active,
  &:disabled,
  &:focus {
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folder: GQLFolder;
  type: 'shared' | 'private' | 'unShare';
  onUpdateStatus?: () => void;
  onCopyText?: () => void;
}

const FolderShareModal = ({
  isOpen,
  onClose,
  type,
  folder,
  onUpdateStatus,
  onCopyText,
}: Props) => {
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
  const modalButton = useMemo(() => {
    if (type === 'shared') {
      return (
        <SafeLinkButton shape="pill" to={toFolderPreview(folder.id)}>
          {t('myNdla.folder.sharing.button.preview')}
        </SafeLinkButton>
      );
    } else if (type === 'private') {
      return (
        <ButtonV2 shape="pill" onClick={onUpdateStatus}>
          {t('myNdla.folder.sharing.button.share')}
        </ButtonV2>
      );
    } else {
      return (
        <ButtonV2 shape="pill" onClick={onUpdateStatus}>
          {t('myNdla.folder.sharing.button.unShare')}
        </ButtonV2>
      );
    }
  }, [folder.id, onUpdateStatus, t, type]);
  const unShareButton = useMemo(
    () =>
      type === 'shared' ? (
        <ButtonV2
          shape="pill"
          variant={isMobile ? 'outline' : 'ghost'}
          colorTheme="danger"
          onClick={() => onUpdateStatus?.()}>
          {t('myNdla.folder.sharing.button.unShare')}
          {!isMobile && <TrashCanOutline />}
        </ButtonV2>
      ) : null,
    [isMobile, onUpdateStatus, t, type],
  );

  return (
    <ModalV2
      controlled
      isOpen={isOpen}
      size="normal"
      onClose={onClose}
      label={t('user.modal.isNotAuth')}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <Title>{t(`myNdla.folder.sharing.header.${type}`)}</Title>
            <ModalCloseButton
              title={t('myNdla.folder.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <StyledModalBody>
            <FolderTitle aria-label={folder.name}>{folder.name}</FolderTitle>
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
                <CopyLinkButton
                  aria-label={`${previewLink(folder.id)}`}
                  variant="stripped"
                  onClick={() => {
                    onCopyText?.();
                    addSnack({
                      id: 'shareLink',
                      content: t('myNdla.folder.sharing.link'),
                    });
                  }}>
                  {previewLink(folder.id)}
                </CopyLinkButton>
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
        </>
      )}
    </ModalV2>
  );
};

export default FolderShareModal;
