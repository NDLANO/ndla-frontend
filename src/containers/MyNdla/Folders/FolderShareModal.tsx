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
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { ButtonV2 } from '@ndla/button';
import { TrashCanOutline } from '@ndla/icons/action';
import { isMobile } from 'react-device-detect';
import { SafeLinkButton } from '@ndla/safelink';
import { useSnack } from '@ndla/ui';
import { GQLFolder } from '../../../graphqlTypes';
import FolderAndResourceCount from './FolderAndResourceCount';
import { toFolderPreview } from '../../../routeHelpers';
import { previewLink } from './FoldersPage';

const Title = styled.h1`
  margin-bottom: 0;
  ${fonts.sizes('30px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px')};
  }
`;

const FolderTitle = styled.h2`
  color: ${colors.brand.primary};
  ${fonts.sizes('16px', '20px')};
  font-weight: ${fonts.weight.semibold};
  border-style: solid;
  padding: ${spacing.small};
  align-items: center;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: 4px;
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
  border-radius: 4px;
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

const CopyLinkHeader = styled.h2`
  ${fonts.sizes('18px')};
  line-height: 24px;
  font-weight: 600;
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

  const cancelButton = (
    <>
      {!(type === 'shared' && isMobile) && (
        <ButtonV2 onClick={onClose} variant="outline">
          {t('cancel')}
        </ButtonV2>
      )}
    </>
  );
  const modalButton = (
    <>
      {type === 'shared' && (
        <SafeLinkButton to={toFolderPreview(folder.id)}>
          {t('myNdla.folder.sharing.button.preview')}
        </SafeLinkButton>
      )}
      {type === 'private' && (
        <ButtonV2 onClick={onUpdateStatus}>
          {t('myNdla.folder.sharing.button.share')}
        </ButtonV2>
      )}
      {type === 'unShare' && (
        <ButtonV2 onClick={onUpdateStatus}>
          {t('myNdla.folder.sharing.button.unShare')}
        </ButtonV2>
      )}
    </>
  );
  const unShareButton = (
    <>
      {type === 'shared' && (
        <ButtonV2
          variant={isMobile ? 'outline' : 'ghost'}
          colorTheme="danger"
          onClick={() => onUpdateStatus?.()}>
          {t('myNdla.folder.sharing.button.unShare')}
          {!isMobile && <TrashCanOutline />}
        </ButtonV2>
      )}
    </>
  );

  return (
    <ModalV2
      controlled
      isOpen={isOpen}
      size="normal"
      onClose={onClose}
      label={t('user.modal.isNotAuth')}>
      {(onCloseModal: any) => (
        <>
          <ModalHeader>
            <Title>{t(`myNdla.folder.sharing.header.${type}`)}</Title>
            <ModalCloseButton
              title={t('myNdla.folder.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <StyledModalBody>
            <div>
              <FolderTitle>{folder.name}</FolderTitle>
              <FolderAndResourceCount
                selectedFolder={folder}
                hasSelectedFolder={!!folder}
                folders={folder.subfolders}
                folderData={folder.subfolders}
                loading={false}
              />
            </div>
            {type === 'shared' && (
              <div>
                <CopyLinkHeader>
                  {t('myNdla.folder.sharing.description.copy')}
                </CopyLinkHeader>
                <CopyLinkButton
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
