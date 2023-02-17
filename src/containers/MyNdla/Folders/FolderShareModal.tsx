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
import { GQLFolder } from '../../../graphqlTypes';
import FolderAndResourceCount from './FolderAndResourceCount';
import config from '../../../config';
import { FolderSharingType } from './FoldersPage';
import { isMobile } from 'react-device-detect';
import { SafeLinkButton } from '@ndla/safelink';
import { css } from '@emotion/react';
import { copyTextToClipboard } from '@ndla/util';

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
  margin: 0;
  border-style: solid;
  padding: ${spacing.small};
  align-items: center;
  border: 1px solid ${colors.brand.neutral7};
  border-radius: 4px;
`;

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0;
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
  width: 100%;

  overflow: hidden;
  white-space: nowrap;

  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;

  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;

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
  flex-direction: row-reverse;
  justify-content: space-between;
  gap: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
    width: 100%;
  }
`;

const buttonCSS = css`
  margin-top: ${spacing.small};
  ${mq.range({ until: breakpoints.mobileWide })} {
    width: 100%;
    margin-top: ${spacing.xsmall};
  }
`;
const StyledButton = styled(ButtonV2)`
  ${buttonCSS}
`;
const StyledLinkButton = styled(SafeLinkButton)`
  ${buttonCSS}
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folder: GQLFolder;
  type: FolderSharingType;
  onUpdateStatus?: () => void;
  onDeleteShare?: (isTrue: boolean) => void;
}

const FolderShareModal = ({
  isOpen,
  onClose,
  type,
  folder,
  onUpdateStatus,
  onDeleteShare,
}: Props) => {
  const { t } = useTranslation();

  const copylink = `${config.ndlaFrontendDomain}/folder/${folder.id}`;
  const buttons = {
    shared: (
      <StyledLinkButton to={copylink}>
        {t('myNdla.folder.share.button.preview')}
      </StyledLinkButton>
    ),
    deleteSharing: (
      <StyledButton
        onClick={() => {
          onUpdateStatus?.();
          onDeleteShare?.(false);
        }}>
        {t('myNdla.folder.share.button.deleteSharing')}
      </StyledButton>
    ),
    private: (
      <StyledButton onClick={onUpdateStatus}>
        {t('myNdla.folder.share.button.share')}
      </StyledButton>
    ),
  };

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
            <Title>{t(`myNdla.folder.share.header.${type}`)}</Title>
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
                  {t('myNdla.folder.share.description.copy')}
                </CopyLinkHeader>
                <CopyLinkButton
                  variant="stripped"
                  onClick={() => copyTextToClipboard(copylink)}>
                  {copylink}
                </CopyLinkButton>
              </div>
            )}
            {t(`myNdla.folder.share.description.${type}`)}
            <StyledButtonRow>
              <StyledButtonRow>
                {buttons[type]}
                <StyledButton onClick={onClose} variant="outline">
                  {t('cancel')}
                </StyledButton>
              </StyledButtonRow>
              {type === 'shared' && (
                <StyledButton
                  variant={isMobile ? 'outline' : 'ghost'}
                  colorTheme="danger"
                  onClick={() => onDeleteShare?.(true)}>
                  {t('myNdla.folder.share.button.deleteSharing')}
                  {!isMobile && <TrashCanOutline />}
                </StyledButton>
              )}
            </StyledButtonRow>
          </StyledModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default FolderShareModal;
