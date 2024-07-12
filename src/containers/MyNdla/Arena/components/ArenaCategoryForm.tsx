/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse } from "query-string";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { LoadingButton } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CheckboxItem, FormControl, Label, Select, FieldErrorMessage as FieldErrorMessageOld } from "@ndla/forms";
import { Spinner } from "@ndla/icons";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { INewCategory } from "@ndla/types-backend/myndla-api";
import { GQLArenaCategoryV2Fragment, GQLTopiclessArenaCategoryV2 } from "../../../../graphqlTypes";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import { useArenaCategoriesV2 } from "../../arenaQueries";
import FieldLength from "../../components/FieldLength";

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

const CheckboxWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const StyledLabel = styled(Label)`
  margin: 0;
  margin-bottom: ${spacing.xxsmall};
`;

interface ArenaFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialVisible?: boolean;
  initialParentCategoryId?: number;
  onSave: (data: Partial<INewCategory>) => Promise<void>;
  onAbort: () => void;
  loading?: boolean;
  id?: number;
}

export interface ArenaCategory {
  title: string;
  content: string;
}

const titleMaxLength = 64;

function getAllCategoryPathAndIds(
  arenaCategories: (GQLArenaCategoryV2Fragment | GQLTopiclessArenaCategoryV2)[],
  breadcrumb: string[] = [],
): { id: number; name: string }[] {
  return arenaCategories
    .map((x) => {
      const newBreadcrumb = [...breadcrumb, x.title];
      const cur = { id: x.id, name: newBreadcrumb.join(" > ") };
      const children = getAllCategoryPathAndIds(x.subcategories ?? [], newBreadcrumb);
      return [cur, ...children];
    })
    .flat();
}

const ArenaCategoryForm = ({
  onSave,
  onAbort,
  initialTitle,
  initialDescription,
  initialVisible,
  initialParentCategoryId,
}: ArenaFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { arenaCategories, loading } = useArenaCategoriesV2({});
  const possibleParents = useMemo(() => {
    if (loading) return [];
    return getAllCategoryPathAndIds(arenaCategories ?? []);
  }, [arenaCategories, loading]);
  const location = useLocation();
  const query = parse(location.search);
  const preselectedParentId = initialParentCategoryId || query["parent-id"];

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: initialTitle ?? "",
      description: initialDescription ?? "",
      visible: initialVisible ?? true,
      parentCategoryId: preselectedParentId,
    },
  });

  useEffect(() => {
    setTimeout(() => document.getElementById(`field-editor`)?.focus(), 1);
  }, []);

  const onSubmit = async (data: INewCategory) => {
    await onSave({
      title: data.title,
      description: data.description,
      visible: data.visible,
      parentCategoryId: data.parentCategoryId,
    });
  };

  if (loading) return <Spinner />;

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <Controller
        control={control}
        name="title"
        rules={{
          required: validationT({ type: "required", field: "title" }),
          maxLength: {
            value: 64,
            message: validationT({
              type: "maxLength",
              field: "title",
              vars: { count: titleMaxLength },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.arena.admin.category.form.title")}</FieldLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value.length ?? 0} maxLength={titleMaxLength} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.arena.admin.category.form.description")}</FieldLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name={"parentCategoryId"}
        rules={{ required: false }}
        render={({ field, fieldState }) => (
          <FormControl id="parentCategoryId" isInvalid={!!fieldState.error?.message}>
            <StyledLabel textStyle="label-small">{t("myNdla.arena.admin.category.form.parentCategoryId")}</StyledLabel>
            <Select {...field}>
              <option>{t("myNdla.arena.admin.category.form.noParentCategory")}</option>
              {possibleParents.map((parent) => (
                <option value={parent.id} key={parent.id}>
                  {parent.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="visible"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FormControl id="visible" isInvalid={!!fieldState.error?.message}>
            <FieldErrorMessageOld>{fieldState.error?.message}</FieldErrorMessageOld>
            <CheckboxWrapper>
              <CheckboxItem
                checked={field.value}
                onCheckedChange={() => {
                  setValue("visible", !field.value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              />
              <Label margin="none" textStyle="label-small">
                {t("myNdla.arena.admin.category.form.visible")}
              </Label>
            </CheckboxWrapper>
          </FormControl>
        )}
      />
      <ButtonRow>
        <Button variant="secondary" onClick={onAbort}>
          {t("cancel")}
        </Button>
        <LoadingButton colorTheme="primary" type="submit">
          {t("myNdla.arena.publish")}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaCategoryForm;
