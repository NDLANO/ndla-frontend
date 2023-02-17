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
import { copyTextToClipboard } from '@ndla/util';
import { TrashCanOutline } from '@ndla/icons/action';
import { GQLFolder } from '../../../graphqlTypes';
import FolderAndResourceCount from './FolderAndResourceCount';
import config from '../../../config';
import { FolderSharingType } from './FoldersPage';
import { isMobile } from 'react-device-detect';

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
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  // Unfortunate css needed for multi-line text overflow ellipsis.
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0;
  }
  display: flex;
  flex-flow: column;
  gap: ${spacing.small};
`;

const FolderWrapper = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.nsmall};
  gap: ${spacing.small};

  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
    align-items: unset;
  }

  border: 1px solid ${colors.brand.neutral7};
  cursor: pointer;
  border-radius: 5px;
  box-shadow: none;
  text-decoration: none;
  &:hover &:active,
  &:disabled,
  &:focus {
    box-shadow: 1px 1px 6px 2px rgba(9, 55, 101, 0.08);
    transition-duration: 0.2s;
  }
  margin-bottom: ${spacing.xsmall};
`;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${spacing.medium};

  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};

  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column-reverse;
    width: 100%;
    margin-bottom: ${spacing.small};
  }
`;

const CopyLinkHeader = styled.h2`
  ${fonts.sizes('16px', '20px')};
  line-height: 24px;
  font-weight: 600;
`;

const CopyLinkWrapper = styled(ButtonV2)`
  height: 48px;
  padding: ${spacing.nsmall};
  color: ${colors.brand.grey};
  background: ${colors.brand.greyLightest};

  border-radius: 4px;
  border: 1px solid ${colors.brand.neutral7};
  color: ${colors.text.primary};
  width: 100%;
  justify-content: left;
  font-style: italic;

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

const ButtonV3 = styled(ButtonV2)`
  ${mq.range({ until: breakpoints.mobileWide })} {
    width: 100%;
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  folder: GQLFolder;
  type: FolderSharingType;
  onUpdateStatus?: () => void;
  onDeleteShare?: (isTrue: boolean) => void;
  onPreview?: () => void;
}

const FolderShareModal = ({
  isOpen,
  onClose,
  type,
  folder,
  onUpdateStatus,
  onDeleteShare,
  onPreview,
}: Props) => {
  const { t } = useTranslation();

  const buttons = {
    shared: (
      <ButtonV3 onClick={onPreview}>
        {t('myNdla.folder.share.button.preview')}
      </ButtonV3>
    ),
    deleteSharing: (
      <ButtonV3
        onClick={() => {
          onUpdateStatus?.();
          onDeleteShare?.(false);
        }}>
        {t('myNdla.folder.share.button.deleteSharing')}
      </ButtonV3>
    ),
    private: (
      <ButtonV3 onClick={onUpdateStatus}>
        {t('myNdla.folder.share.button.share')}
      </ButtonV3>
    ),
  };

  const copylink = `${config.ndlaFrontendDomain}/${folder.name}`;

  return (
    <ModalV2
      controlled
      isOpen={isOpen}
      size="normal"
      onClose={onClose}
      label={t('user.modal.isNotAuth')}>
      {(onCloseModal: any) => (
        <div>
          <ModalHeader>
            <Title>{t(`myNdla.folder.share.header.${type}`)}</Title>
            <ModalCloseButton
              title={t('myNdla.folder.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <StyledModalBody>
            <div>
              <FolderWrapper>
                <FolderTitle>{folder.name}</FolderTitle>
              </FolderWrapper>
              <FolderAndResourceCount
                selectedFolder={folder}
                hasSelectedFolder={!!folder}
                folders={folder.subfolders}
                folderData={folder.subfolders}
                loading={false}
              />
            </div>
            {type === 'shared' && (
              <>
                <CopyLinkHeader>
                  {t('myNdla.folder.share.description.copy')}
                </CopyLinkHeader>
                <CopyLinkWrapper
                  variant="stripped"
                  onClick={() => copyTextToClipboard(copylink)}>
                  {copylink}
                </CopyLinkWrapper>
              </>
            )}
            {t(`myNdla.folder.share.description.${type}`)}
            <StyledButtonRow>
              <div>
                {type === 'shared' && (
                  <ButtonV3
                    variant={isMobile ? 'outline' : 'ghost'}
                    colorTheme="danger"
                    onClick={() => onDeleteShare?.(true)}>
                    {t('myNdla.folder.share.button.deleteSharing')}
                    {!isMobile && <TrashCanOutline />}
                  </ButtonV3>
                )}
              </div>
              <StyledButtonGroup>
                <ButtonV3 onClick={onClose} variant="outline">
                  {t('cancel')}
                </ButtonV3>
                {buttons[type]}
              </StyledButtonGroup>
            </StyledButtonRow>
          </StyledModalBody>
        </div>
      )}
    </ModalV2>
  );
};

export default FolderShareModal;
