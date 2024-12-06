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
import { SelectHiddenSelect, SelectIndicator, SelectValueText } from "@ark-ui/react";
import { createListCollection } from "@ark-ui/react/collection";
import { CloseLine, ArrowDownShortLine, CheckLine } from "@ndla/icons";
import {
  Button,
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
  SelectControl,
  SelectLabel,
  SelectTrigger,
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectClearTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { INewCategory } from "@ndla/types-backend/myndla-api";
import { GQLArenaCategoryV2Fragment, GQLTopiclessArenaCategoryV2 } from "../../../../graphqlTypes";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import { useArenaCategoriesV2 } from "../../arenaQueries";
import FieldLength from "../../components/FieldLength";

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const ButtonRow = styled("div", {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: "xxsmall",
  },
});

const FullWidthButton = styled(Button, {
  base: {
    width: "100%",
  },
});

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
): { value: number; label: string }[] {
  return arenaCategories
    .map((x) => {
      const newBreadcrumb = [...breadcrumb, x.title];
      const cur = { value: x.id, label: newBreadcrumb.join(" > ") };
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

  const possibleParentsCollection = useMemo(() => createListCollection({ items: possibleParents }), [possibleParents]);

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
          <FieldRoot invalid={!!fieldState.error?.message}>
            <SelectRoot
              collection={possibleParentsCollection}
              defaultValue={[field.value]}
              positioning={{
                sameWidth: true,
              }}
            >
              <SelectLabel>{t("myNdla.arena.admin.category.form.parentCategoryId")}</SelectLabel>
              <SelectHiddenSelect {...field} />
              <SelectControl>
                <SelectTrigger asChild>
                  <FullWidthButton variant="secondary">
                    <SelectValueText placeholder={t("myNdla.arena.admin.category.form.noParentCategory")} />
                    <SelectIndicator asChild>
                      <ArrowDownShortLine />
                    </SelectIndicator>
                  </FullWidthButton>
                </SelectTrigger>
                <SelectClearTrigger asChild>
                  <IconButton variant="secondary">
                    <CloseLine />
                  </IconButton>
                </SelectClearTrigger>
              </SelectControl>
              <SelectContent>
                {possibleParents.map((option) => (
                  <SelectItem item={option} key={option.value}>
                    <SelectItemText>{option.label}</SelectItemText>
                    <SelectItemIndicator asChild>
                      <CheckLine />
                    </SelectItemIndicator>
                  </SelectItem>
                ))}
              </SelectContent>
              <SelectHiddenSelect />
            </SelectRoot>
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="visible"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message}>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <CheckboxRoot
              checked={field.value}
              onCheckedChange={() => {
                setValue("visible", !field.value, {
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
              <CheckboxLabel>{t("myNdla.arena.admin.category.form.visible")}</CheckboxLabel>
              <CheckboxHiddenInput />
            </CheckboxRoot>
          </FieldRoot>
        )}
      />
      <ButtonRow>
        <Button variant="secondary" onClick={onAbort}>
          {t("cancel")}
        </Button>
        <Button type="submit">{t("myNdla.arena.publish")}</Button>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaCategoryForm;
