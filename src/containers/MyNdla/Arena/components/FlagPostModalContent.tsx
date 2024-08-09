/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import {
  Button,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  FieldErrorMessage,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  RadioGroupRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@ndla/primitives";
import { Text } from "@ndla/typography";
import { useArenaNewFlagMutation } from "./temporaryNodebbHooks";
import { DialogCloseButton } from "../../../../components/DialogCloseButton";
import { useToast } from "../../../../components/ToastContext";
import handleError from "../../../../util/handleError";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

const MAXIMUM_LENGTH_TEXTFIELD = 120;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledTextArea = styled(FieldTextArea)`
  min-height: 74px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface FlagPost {
  type: string;
  reason: string;
}

interface FlagPostModalProps {
  id: number;
  onClose: () => void;
}

const FlagPostModalContent = ({ id, onClose }: FlagPostModalProps) => {
  const { addNewFlag } = useArenaNewFlagMutation();
  const { validationT } = useValidationTranslation();
  const { t } = useTranslation();
  const toast = useToast();
  const [showReasonField, setShowReasonField] = useState<boolean>(false);
  const { handleSubmit, control, setValue } = useForm({ defaultValues: { type: "spam", reason: "" } });

  const sendReport = async (data: FlagPost) => {
    try {
      await addNewFlag({
        variables: {
          id,
          type: "post",
          reason: data.reason === "other" ? data.type : data.reason,
        },
      });
      toast.create({
        title: t("myNdla.arena.reported"),
        description: t("myNdla.arena.flag.success"),
      });
    } catch (err) {
      const typedError = err as { message?: string };
      toast.create({
        title: t("myNdla.arena.error"),
        description: typedError.message,
      });
      handleError(err);
    }
    onClose();
  };

  const radioButtonOptions = [
    { title: t("myNdla.arena.flag.spam"), value: "spam" },
    {
      title: t("myNdla.arena.flag.offensive"),
      value: "offensive",
    },
    { title: t("myNdla.arena.flag.other"), value: "other" },
  ];

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("myNdla.arena.flag.title")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Text element="p" textStyle="meta-text-medium" margin="none">
          {t("myNdla.arena.flag.disclaimer")}
        </Text>
        <StyledForm onSubmit={handleSubmit(sendReport)} noValidate>
          <Controller
            control={control}
            name="type"
            rules={{
              required: validationT({
                type: "required",
              }),
            }}
            render={({ field }) => (
              <FieldRoot>
                <RadioGroupRoot
                  defaultValue="spam"
                  onValueChange={(details) => {
                    setValue("type", details.value, {
                      shouldDirty: true,
                    });
                    setShowReasonField(details.value === "other");
                  }}
                >
                  <RadioGroupLabel srOnly>{t("myNdla.arena.flag.reason")}</RadioGroupLabel>
                  {radioButtonOptions.map((option) => (
                    <RadioGroupItem value={option.value} key={option.value}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{option.title}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput {...field} />
                    </RadioGroupItem>
                  ))}
                </RadioGroupRoot>
              </FieldRoot>
            )}
          />
          {showReasonField && (
            <Controller
              control={control}
              name="reason"
              rules={{
                required: validationT({ type: "required" }),
                maxLength: {
                  value: MAXIMUM_LENGTH_TEXTFIELD,
                  message: validationT({
                    type: "maxLength",
                    vars: { count: MAXIMUM_LENGTH_TEXTFIELD },
                  }),
                },
              }}
              render={({ field, fieldState }) => (
                <FieldRoot invalid={!!fieldState.error?.message}>
                  <FieldLabel>{t("myNdla.arena.flag.reason")}</FieldLabel>
                  <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
                  <StyledTextArea {...field} maxLength={MAXIMUM_LENGTH_TEXTFIELD} />
                  <FieldLength value={field.value.length ?? 0} maxLength={MAXIMUM_LENGTH_TEXTFIELD} />
                </FieldRoot>
              )}
            />
          )}
          <StyledButtonRow>
            <Button variant="secondary" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit">{t("myNdla.arena.flag.send")}</Button>
          </StyledButtonRow>
        </StyledForm>
      </DialogBody>
    </DialogContent>
  );
};

export default FlagPostModalContent;
