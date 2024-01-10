/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2, LoadingButton } from '@ndla/button';
import { colors, misc, spacing } from '@ndla/core';
import { FormControl, InputV3, Label, FieldErrorMessage } from '@ndla/forms';
import { InformationOutline } from '@ndla/icons/common';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ndla/modal';
import { Text } from '@ndla/typography';
import { MarkdownEditor } from '../../../../components/MarkdownEditor/MarkdownEditor';
import { FieldLength } from '../../../../containers/MyNdla/Folders/FolderForm';
import useValidationTranslation from '../../../../util/useValidationTranslation';
import { iconCss } from '../../Folders/FoldersPage';

export const ArenaFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  padding: ${spacing.normal};
  background-color: ${colors.background.lightBlue};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
`;

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
  gap: ${spacing.small};
  align-items: center;
`;

const StyledLabel = styled(Label)`
  margin: 0;
  margin-bottom: ${spacing.xxsmall};
`;

const FieldInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

const StyledInformationOutline = styled(InformationOutline)`
  ${iconCss};
  overflow: unset !important;
`;

const StyledInput = styled(InputV3)`
  background: ${colors.white};
`;

const StyledWarningText = styled(Text)`
  padding: ${spacing.large} 0 ${spacing.large} ${spacing.normal};
`;

interface ArenaFormProps {
  type: 'topic' | 'post';
  initialTitle?: string;
  initialContent?: string;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  onAbort: () => void;
  loading?: boolean;
  id?: number;
}

export interface ArenaFormValues {
  title: string;
  content: string;
}

const titleMaxLength = 64;

const ArenaForm = ({
  onSave,
  onAbort,
  type,
  initialTitle,
  initialContent,
  id,
}: ArenaFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const { formState, trigger, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: initialTitle ?? '',
      content: initialContent ?? '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    type === 'topic'
      ? setTimeout(() => document.getElementById('field-title')?.focus(), 1)
      : id
        ? setTimeout(
            () => document.getElementById(`field-editor-${id}`)?.focus(),
            1,
          )
        : setTimeout(() => document.getElementById(`field-editor`)?.focus(), 1);
  }, [id, type]);

  const onSubmit = async (data: ArenaFormValues) => {
    await onSave(
      type === 'topic'
        ? { title: data.title, content: data.content }
        : { content: data.content },
    );
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      {type === 'topic' && (
        <Controller
          control={control}
          name="title"
          rules={{
            required: validationT({ type: 'required', field: 'content' }),
            maxLength: {
              value: 64,
              message: validationT({
                type: 'maxLength',
                field: 'title',
                vars: { count: titleMaxLength },
              }),
            },
          }}
          render={({ field, fieldState }) => (
            <FormControl
              id="title"
              isRequired
              isInvalid={!!fieldState.error?.message}
            >
              <StyledLabel textStyle="label-small">{t('title')}</StyledLabel>
              <StyledInput {...field} />
              <FieldInfoWrapper>
                <FieldLength
                  value={field.value.length ?? 0}
                  maxLength={titleMaxLength}
                />
                <FieldErrorMessage>
                  {fieldState.error?.message}
                </FieldErrorMessage>
              </FieldInfoWrapper>
            </FormControl>
          )}
        />
      )}
      <Controller
        control={control}
        name="content"
        rules={{
          required: validationT({ type: 'required', field: 'content' }),
        }}
        render={({ field, fieldState }) => (
          <FormControl
            id={id ? `editor-${id}` : 'editor'}
            isRequired
            isInvalid={!!fieldState.error?.message}
          >
            <StyledLabel
              textStyle="label-small"
              onClick={() => document.getElementById('field-editor')?.focus()}
            >
              {type === 'post'
                ? t('myNdla.arena.new.post')
                : t('myNdla.arena.topic.topicContent')}
            </StyledLabel>
            <MarkdownEditor
              setContentWritten={(val) => {
                setValue('content', val, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              initialValue={initialContent ?? ''}
              {...field}
            />
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
          </FormControl>
        )}
      />
      <InformationLabel>
        <StyledInformationOutline />
        <Text margin="none" textStyle="content">
          {t(`myNdla.arena.warning.${type}`)}
        </Text>
      </InformationLabel>
      <ButtonRow>
        <Modal open={open} onOpenChange={setOpen}>
          <ModalTrigger>
            <ButtonV2
              variant="outline"
              onClick={() => (formState.isDirty ? setOpen(true) : onAbort())}
            >
              {t('cancel')}
            </ButtonV2>
          </ModalTrigger>
          <ModalContent>
            <ModalBody>
              <ModalHeader>
                <ModalTitle>
                  {t(`myNdla.arena.cancel.title.${type}`)}
                </ModalTitle>
                <ModalCloseButton title={t('myNdla.folder.closeModal')} />
              </ModalHeader>
              <StyledWarningText margin="none" textStyle="meta-text-medium">
                {t(`myNdla.arena.cancel.content.${type}`)}
              </StyledWarningText>
              <ButtonRow>
                <ButtonV2 variant="outline" onClick={() => setOpen(false)}>
                  {t(`myNdla.arena.cancel.continue.${type}`)}
                </ButtonV2>
                <ButtonV2 colorTheme="danger" onClick={onAbort}>
                  {t(`myNdla.arena.cancel.cancel.${type}`)}
                </ButtonV2>
              </ButtonRow>
            </ModalBody>
          </ModalContent>
        </Modal>
        <LoadingButton
          colorTheme="primary"
          type="submit"
          disabled={!formState.isDirty || !formState.isValid}
        >
          {t('myNdla.arena.publish')}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaForm;
