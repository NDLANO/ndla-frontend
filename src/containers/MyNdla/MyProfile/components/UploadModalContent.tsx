/*
 * Copyright (c) 2022-present, NDLA.
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
  height: 100%;
`;

const UploadTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DragAndDropText = styled.div`
  ${fonts.sizes('18px', '32px')};
  font-weight: ${fonts.weight.bold};
`;

const ClickToUploadText = styled.div`
  ${fonts.sizes('16px', '26px')};
`;

const FileText = styled.div``;

const TextAndButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
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

  // change to single file
  const onAddFiles = useCallback((files: File[]) => {
    setIsLoading(true);
    setTimeout(() => {
      setAddedFiles((prev) => prev?.concat(files));
      setIsLoading(false);
    }, 500);
  }, []);

  // missing logic to add files via queries/cancel modal
  return (
    <StyledModalContent
      size={{
        width: 'normal',
        height: 'small',
      }}
      animation="zoom"
    >
      <ModalHeader>
        <ModalTitle>Last opp nytt profilbilde</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
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
        {addedFiles &&
          addedFiles.map((file) => (
            <FileText key={file.name}>{`Opplastet fil: ${file.name}`}</FileText>
          ))}
        <TextAndButtonContainer>
          <AcceptableFileTypes>
            {'Filtyper som er akseptert: PNG, JPG (Maks 5MB)'}
          </AcceptableFileTypes>
          <ButtonContainer>
            <ButtonV2 fontWeight="semibold" variant="outline">
              {'Avbryt'}
            </ButtonV2>
            <ButtonV2 fontWeight="semibold">{'Lagre profilbilde'}</ButtonV2>
          </ButtonContainer>
        </TextAndButtonContainer>
      </ModalBody>
    </StyledModalContent>
  );
};

export default UploadModalContent;
