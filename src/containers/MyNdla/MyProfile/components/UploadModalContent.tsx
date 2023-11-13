/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { fonts, spacing } from '@ndla/core';
import { UploadDropZone } from '@ndla/forms';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';

const StyledModalContent = styled(ModalContent)`
  border-radius: ${spacing.xxsmall};
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const UploadTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const DragAndDropText = styled.div`
  ${fonts.sizes('18px', '32px')};
  font-weight: ${fonts.weight.bold};
`;

const ClickToUploadText = styled.div`
  ${fonts.sizes('16px', '26px')};
`;

const FileText = styled.div`
  ${fonts.sizes('14px', '32px')};
`;

const TextAndButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AcceptableFileTypes = styled.div`
  ${fonts.sizes('14px', '32px')};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const UploadModalContent = () => {
  const [addedFiles, setAddedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  // UploadDropZone requires array?
  const onAddFiles = useCallback((files: File[]) => {
    setIsLoading(true);
    setTimeout(() => {
      setAddedFiles(files);
      setIsLoading(false);
    }, 500);
  }, []);

  const deleteProfilePicture = () => {
    //query to delete picture
  };

  const cancel = () => {
    setAddedFiles([]);
  };

  const addProfilePicture = () => {
    //query to add picture
  };

  return (
    <StyledModalContent
      size={{
        width: 'normal',
        height: 'small',
      }}
      animation="zoom" //fade works only on modal, uploadDropZone keeps zoom animation
    >
      <StyledModalHeader>
        <ModalTitle>Last opp nytt profilbilde</ModalTitle>
        <ModalCloseButton />
      </StyledModalHeader>
      <ModalBody>
        <UploadDropZone
          name="file"
          allowedFiles={['image/png', 'image/jpeg', 'image/jpg']}
          multiple={false}
          onAddedFiles={onAddFiles}
          loading={isLoading}
          ariaLabel="text"
        >
          <UploadTextContainer>
            <DragAndDropText>{'Dra og slipp '}</DragAndDropText>
            <ClickToUploadText>
              {'eller trykk for å laste opp bilde'}
            </ClickToUploadText>
          </UploadTextContainer>
        </UploadDropZone>
        {addedFiles.length > 0 && (
          <FileText
            key={addedFiles?.at(0)?.name}
          >{`Opplastet fil: ${addedFiles?.at(0)?.name}`}</FileText>
        )}
        <TextAndButtonContainer>
          <AcceptableFileTypes>
            {'Godkjente filtyper: PNG, JPG (Maks 5MB)'}
          </AcceptableFileTypes>
          <ButtonContainer>
            <ButtonV2 fontWeight="semibold" onClick={deleteProfilePicture}>
              {'Slett profilbilde'}
            </ButtonV2>
            <ButtonV2 fontWeight="semibold" variant="outline" onClick={cancel}>
              {'Avbryt'}
            </ButtonV2>
            <ButtonV2 fontWeight="semibold" onClick={addProfilePicture}>
              {'Lagre profilbilde'}
            </ButtonV2>
          </ButtonContainer>
        </TextAndButtonContainer>
      </ModalBody>
    </StyledModalContent>
  );
};

export default UploadModalContent;
