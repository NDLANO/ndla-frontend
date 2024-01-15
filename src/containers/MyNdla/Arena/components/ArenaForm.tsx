/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { LoadingButton } from '@ndla/button';
import { colors, misc, spacing } from '@ndla/core';
import { FormControl, InputV3, Label, FieldErrorMessage } from '@ndla/forms';
import { InformationOutline } from '@ndla/icons/common';
import { Text } from '@ndla/typography';
import { MarkdownEditor } from '../../../../components/MarkdownEditor/MarkdownEditor';
import { FieldLength } from '../../../../containers/MyNdla/Folders/FolderForm';
import useValidationTranslation from '../../../../util/useValidationTranslation';
import { iconCss } from '../../Folders/FoldersPage';
import AlertModal from './AlertModal';

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
        <AlertModal
          onAbort={onAbort}
          postType={type}
          formState={formState}
          initialContent={initialContent}
        />
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
