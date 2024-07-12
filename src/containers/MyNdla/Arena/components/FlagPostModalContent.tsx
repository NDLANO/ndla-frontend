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
import { LoadingButton } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { FormControl, Label, RadioButtonGroup, RadioButtonItem, Fieldset, Legend } from "@ndla/forms";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle, ModalContent } from "@ndla/modal";
import { Button, FieldLabel, FieldRoot, FieldTextArea, FieldErrorMessage } from "@ndla/primitives";
import { Text } from "@ndla/typography";
import { useSnack } from "@ndla/ui";
import { useArenaNewFlagMutation } from "./temporaryNodebbHooks";
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

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-flow: column;
  gap: ${spacing.nsmall};
`;

const StyledTextArea = styled(FieldTextArea)`
  min-height: 74px;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  flex-direction: row;
  color: ${colors.brand.primary};
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
  const { addSnack } = useSnack();
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
      addSnack({
        content: t("myNdla.arena.flag.success"),
        id: "reportPostAdded",
      });
    } catch (err) {
      const typedError = err as { message?: string };
      addSnack({
        content: typedError.message,
        id: "reportPostAddedError",
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
    <ModalContent forceOverlay>
      <ModalHeader>
        <ModalTitle>{t("myNdla.arena.flag.title")}</ModalTitle>
        <ModalCloseButton title={t("modal.closeModal")} />
      </ModalHeader>
      <StyledModalBody>
        <Text element="p" textStyle="meta-text-medium" margin="none">
          {t("myNdla.arena.flag.disclaimer")}
        </Text>
        <form onSubmit={handleSubmit(sendReport)} noValidate>
          <Controller
            control={control}
            name="type"
            rules={{
              required: validationT({
                type: "required",
              }),
            }}
            render={({ field }) => (
              <FormControl id="flag-type">
                <RadioButtonGroup
                  {...field}
                  asChild
                  onValueChange={(value) => {
                    setValue("type", value, {
                      shouldDirty: true,
                    });
                    setShowReasonField(value === "other");
                  }}
                >
                  <Fieldset>
                    <Legend visuallyHidden>{t("myNdla.arena.flag.reason")}</Legend>
                    {radioButtonOptions.map((option) => (
                      <RadioButtonWrapper key={option.value}>
                        <RadioButtonItem id={`flag-${option.value}`} value={option.value} />
                        <Label htmlFor={`flag-${option.value}`} margin="none" textStyle="label-small">
                          {option.title}
                        </Label>
                      </RadioButtonWrapper>
                    ))}
                  </Fieldset>
                </RadioButtonGroup>
              </FormControl>
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
            <LoadingButton colorTheme="primary" type="submit">
              {t("myNdla.arena.flag.send")}
            </LoadingButton>
          </StyledButtonRow>
        </form>
      </StyledModalBody>
    </ModalContent>
  );
};

export default FlagPostModalContent;
