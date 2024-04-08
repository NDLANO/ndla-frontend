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
import { ButtonV2, LoadingButton } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { FormControl, InputV3, Label, FieldErrorMessage, CheckboxItem, Select } from "@ndla/forms";
import { Spinner } from "@ndla/icons";
import { INewCategory } from "../../../../../../backend/typescript/types-backend/myndla-api";
import { GQLArenaCategoryV2Fragment, GQLTopiclessArenaCategoryV2 } from "../../../../graphqlTypes";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import { useArenaCategoriesV2 } from "../../arenaQueries";
import { FieldLength } from "../../Folders/FolderForm";

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

const StyledLabel = styled(Label)`
  margin: 0;
  margin-bottom: ${spacing.xxsmall};
`;

const StyledInput = styled(InputV3)`
  background: ${colors.white};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
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
          <FormControl id="title" isRequired isInvalid={!!fieldState.error?.message}>
            <StyledLabel textStyle="label-small">{t("myNdla.arena.admin.category.form.title")}</StyledLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <StyledInput {...field} />
            <FieldLength value={field.value.length ?? 0} maxLength={titleMaxLength} />
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FormControl id="editor" isRequired isInvalid={!!fieldState.error?.message}>
            <StyledLabel textStyle="label-small">{t("myNdla.arena.admin.category.form.description")}</StyledLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <StyledInput {...field} />
          </FormControl>
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
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
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
        <ButtonV2 variant="outline" onClick={onAbort}>
          {t("cancel")}
        </ButtonV2>
        <LoadingButton colorTheme="primary" type="submit">
          {t("myNdla.arena.publish")}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaCategoryForm;
