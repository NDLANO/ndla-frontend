/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2, LoadingButton } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import {
  FormControl,
  InputV3,
  InputContainer,
  Label,
  FieldErrorMessage,
} from '@ndla/forms';
import { InformationOutline } from '@ndla/icons/common';
import { ModalCloseButton } from '@ndla/modal';
import { Text } from '@ndla/typography';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { FieldLength } from '../../../../containers/MyNdla/Folders/FolderForm';
import { MarkdownEditor } from '../../../../components/MarkdownEditor/MarkdownEditor';
import useValidationTranslation from '../../../../util/useValidationTranslation';

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const InformationLabel = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};
  align-items: center;
  border-radius: ${spacing.xxsmall};
  padding: ${spacing.small} ${spacing.normal};
  background-color: ${colors.support.yellowLight};
`;

const StyledInformationOutline = styled(InformationOutline)`
  height: ${spacing.snormal};
  width: ${spacing.snormal};
`;

const StyledInputContainer = styled(InputContainer)`
  padding: unset;
`;

interface ArenaFormProps {
  type: 'topic' | 'post';
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  loading?: boolean;
}

export interface ArenaFormValues {
  title: string;
  content: string;
}

const contentMaxLength = 300;
const titleMaxLength = 64;

const ArenaForm = ({
  onSave,
  type,
  initialTitle,
  initialContent,
}: ArenaFormProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle ?? '');
  const [content, setContent] = useState(initialContent ?? '');
  const { validationT } = useValidationTranslation();

  const onSubmit = async () => {
    await onSave(type === 'topic' ? { title, content } : { content });
  };

  const isValidTitleLength = title.length <= titleMaxLength;
  const isValidTitleContent = title !== '';
  const isValidContentLength = content.length <= contentMaxLength;
  const isValidContentContent = content.length > 8;

  const isValidTitle = isValidTitleContent && isValidTitleLength;
  const isValidContent = isValidContentContent && isValidContentLength;

  const isValid = isValidContent || isValidTitle;

  const isDirty = useMemo(
    () => !isEqual(initialTitle, title) || !isEqual(initialContent, content),
    [initialTitle, initialContent, content, title],
  );

  return (
    <StyledForm onSubmit={onSubmit}>
      {type === 'topic' && (
        <FormControl id="title" isRequired isInvalid={!isValidTitle}>
          <Label>{t('title')}</Label>
          <StyledInputContainer>
            <InputV3
              name="title"
              aria-describedby="title-info"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </StyledInputContainer>
          {!isValidTitle && (
            <FieldErrorMessage id="name-error">
              {!isValidTitleContent &&
                validationT({ type: 'required', field: 'title' })}
              {!isValidTitleLength &&
                validationT({
                  type: 'maxLength',
                  field: 'title',
                  vars: { count: titleMaxLength },
                })}
            </FieldErrorMessage>
          )}
          <FieldLength value={title.length ?? 0} maxLength={titleMaxLength} />
        </FormControl>
      )}
      <FormControl id="editor" isRequired isInvalid={!isValidContent}>
        <Label htmlFor="markdown-editor">
          {t('myNdla.arena.topic.topicContent')}
        </Label>
        <StyledInputContainer>
          <MarkdownEditor
            setContentWritten={setContent}
            initialValue={content ?? ''}
          />
        </StyledInputContainer>
        {!isValidContent && (
          <FieldErrorMessage id="name-error">
            {!isValidContentLength &&
              validationT({
                type: 'maxLength',
                field: 'content',
                vars: { count: contentMaxLength },
              })}
            {!isValidContentContent &&
              validationT({ type: 'required', field: 'content' })}
          </FieldErrorMessage>
        )}
        <FieldLength value={content.length ?? 0} maxLength={contentMaxLength} />
      </FormControl>
      <InformationLabel>
        <StyledInformationOutline />
        <Text margin="none" textStyle="content">
          {t(`myNdla.arena.warning.${type}`)}
        </Text>
      </InformationLabel>
      <ButtonRow>
        <ModalCloseButton>
          <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
        </ModalCloseButton>
        <LoadingButton
          colorTheme="light"
          type="submit"
          disabled={!isDirty || !isValid}
        >
          {t('myNdla.arena.publish')}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaForm;
