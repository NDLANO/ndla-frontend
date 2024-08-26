/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, Suspense, lazy, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InformationOutline } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Spinner,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Button,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import AlertModal from "./AlertModal";
import { AuthContext } from "../../../../components/AuthenticationContext";
import config from "../../../../config";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

const MarkdownEditor = lazy(() => import("../../../../components/MarkdownEditor/MarkdownEditor"));

export const ArenaFormWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    borderRadius: "small",
    border: "1px solid",
    borderColor: "stroke.info",
  },
});

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledMessageBox = styled(MessageBox, {
  base: {
    display: "flex",
    alignItems: "center",
  },
});

interface ArenaFormProps {
  type: "topic" | "post";
  initialTitle?: string;
  initialContent?: string;
  initialLocked?: boolean;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  onAbort: () => void;
  loading?: boolean;
  id?: number | string;
}

export interface ArenaFormValues {
  title: string;
  content: string;
  locked: boolean;
}

const titleMaxLength = 64;
const contentMaxLength = 32767;

const ArenaForm = ({ onSave, onAbort, type, initialTitle, initialContent, initialLocked, id }: ArenaFormProps) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { validationT } = useValidationTranslation();
  const { formState, control, handleSubmit, setValue } = useForm({
    defaultValues: { title: initialTitle ?? "", content: initialContent ?? "", locked: initialLocked ?? false },
  });

  useEffect(() => {
    type === "topic"
      ? setTimeout(() => document.getElementById("field-title")?.focus(), 1)
      : id
        ? setTimeout(() => document.getElementById(`field-editor-${id}`)?.focus(), 1)
        : setTimeout(() => document.getElementById(`field-editor`)?.focus(), 1);
  }, [id, type]);

  const onSubmit = async ({ title, content, locked }: ArenaFormValues) => {
    await onSave(
      type === "topic"
        ? {
            title: title,
            content: content,
            locked: locked,
          }
        : { content: content },
    );
  };

  const showLockedOption = user?.isModerator && type === "topic" && !config.enableNodeBB;

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      {type === "topic" && (
        <Controller
          control={control}
          name="title"
          rules={{
            required: validationT({ type: "required", field: "title" }),
            maxLength: {
              value: titleMaxLength,
              message: validationT({
                type: "maxLength",
                field: "title",
                vars: { count: titleMaxLength },
              }),
            },
          }}
          render={({ field, fieldState }) => (
            <FieldRoot required invalid={!!fieldState.error?.message}>
              <FieldLabel>{t("title")}</FieldLabel>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <FieldInput {...field} />
              <FieldLength value={field.value.length ?? 0} maxLength={titleMaxLength} />
            </FieldRoot>
          )}
        />
      )}
      <Controller
        control={control}
        name="content"
        rules={{
          required: validationT({
            type: "required",
            field: "content",
          }),
          maxLength: {
            value: contentMaxLength,
            message: validationT({
              type: "maxLength",
              field: "content",
              vars: { count: contentMaxLength },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel textStyle="label.large" onClick={() => document.getElementById("markdown-editor")?.focus()}>
              {type === "post" ? t("myNdla.arena.new.post") : t("myNdla.arena.topic.topicContent")}
            </FieldLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <Suspense fallback={<Spinner />}>
              <MarkdownEditor
                setContentWritten={(val) => {
                  setValue("content", val, {
                    shouldDirty: true,
                  });
                }}
                initialValue={initialContent ?? ""}
                {...field}
              />
              <FieldLength value={field.value.length ?? 0} maxLength={contentMaxLength} />
            </Suspense>
          </FieldRoot>
        )}
      />
      {showLockedOption && (
        <Controller
          control={control}
          name="locked"
          rules={{ required: false }}
          render={({ field, fieldState }) => (
            <FieldRoot invalid={!!fieldState.error?.message}>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <CheckboxRoot
                checked={field.value}
                onCheckedChange={() => {
                  setValue("locked", !field.value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxLabel>{t("myNdla.arena.topic.locked")}</CheckboxLabel>
                <CheckboxHiddenInput />
              </CheckboxRoot>
            </FieldRoot>
          )}
        />
      )}
      <StyledMessageBox variant="info">
        <InformationOutline />
        <Text>{t(`myNdla.arena.warning.${type}`)}</Text>
      </StyledMessageBox>
      <HStack gap="small" justify="flex-end">
        <AlertModal onAbort={onAbort} postType={type} formState={formState} initialContent={initialContent} />
        <Button type="submit">{t("myNdla.arena.publish")}</Button>
      </HStack>
    </StyledForm>
  );
};

export default ArenaForm;
