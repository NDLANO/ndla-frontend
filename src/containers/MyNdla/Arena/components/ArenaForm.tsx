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
import { InputV3 } from '@ndla/forms';
import { InformationOutline } from '@ndla/icons/common';
import { ModalCloseButton } from '@ndla/modal';
import { Text } from '@ndla/typography';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FieldLength } from '../../../../containers/MyNdla/Folders/FolderForm';
import useValidationTranslation from '../../../../util/useValidationTranslation';
import { GQLArenaTopicFragmentFragment } from '../../../../graphqlTypes';
import { MarkdownEditor } from '../../../../components/MarkdownEditor/MarkdownEditor';

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

interface ArenaFormProps {
  type: 'topic' | 'post';
  title?: string;
  content?: string;
  siblingTopics: GQLArenaTopicFragmentFragment[];
  onSave: (data: ArenaFormValues) => Promise<void>;
  loading?: boolean;
}

export interface ArenaFormValues {
  title?: string;
  content?: string;
}

const descriptionMaxLength = 300;
const titleMaxLength = 64;

const toFormValues = (
  title: string | undefined,
  content: string | undefined,
) => ({
  title: title ?? '',
  content: content ?? '',
});

const ArenaForm = ({
  onSave,
  siblingTopics,
  loading,
  type,
  title,
  content,
}: ArenaFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const {
    control,
    trigger,
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
  } = useForm({
    defaultValues: toFormValues(title, content),
    reValidateMode: 'onChange',
    mode: 'all',
  });

  // Validate on mount.
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: ArenaFormValues) => {
    console.log(values);
    await onSave(values);
  };
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {type === 'topic' && (
        <Controller
          name="title"
          control={control}
          rules={{
            required: validationT({ type: 'required', field: 'title' }),
            maxLength: {
              value: titleMaxLength,
              message: validationT({
                type: 'maxLength',
                field: 'title',
                vars: { count: titleMaxLength },
              }),
            },
            validate: (title) => {
              const exists = siblingTopics.every(
                (s) => s.title.toLowerCase() !== title?.toLowerCase(),
              );
              if (!exists) {
                return validationT('validation.notUnique');
              }
              return true;
            },
          }}
          render={({ field }) => (
            <div>
              <Text margin="none" textStyle="label-small">
                {t('title')}
              </Text>
              <InputV3 id="title" required {...field} />
              <FieldLength
                value={field.value?.length ?? 0}
                maxLength={titleMaxLength}
              />
            </div>
          )}
        />
      )}
      <Controller
        control={control}
        name="content"
        rules={{
          required: true,
          maxLength: {
            value: descriptionMaxLength,
            message: validationT({
              type: 'maxLength',
              field: 'content',
              vars: { count: descriptionMaxLength },
            }),
          },
        }}
        render={({ field }) => (
          <div>
            {type === 'topic' && (
              <Text element="label" margin="none" textStyle="label-small">
                {t('arena.topic.topicContent')}
              </Text>
            )}
            <MarkdownEditor
              setContentWritten={(data) =>
                setValue('content', data, {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }
              initialValue={content ?? ''}
            />
            <FieldLength
              value={field.value?.length ?? 0}
              maxLength={descriptionMaxLength}
            />
          </div>
        )}
      />
      <InformationLabel>
        <StyledInformationOutline />
        <Text margin="none" textStyle="content">
          {t('arena.topic.warning', { type })}
        </Text>
      </InformationLabel>
      <ButtonRow>
        <ModalCloseButton>
          <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
        </ModalCloseButton>
        <LoadingButton
          colorTheme="light"
          loading={loading}
          type="submit"
          disabled={!isValid || !isDirty || loading}
        >
          {t('arena.publish')}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaForm;
