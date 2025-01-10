/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { Controller, useFormContext } from "react-hook-form";
import { FieldErrorMessage, FieldHelper, FieldInput, FieldLabel, FieldRoot, Spinner } from "@ndla/primitives";
import {
  RichTextEditor,
  richTextEditorComponents,
  useRichTextEditor,
} from "../../../../components/Editor/RichTextEditor";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";
import { Plate } from "@udecode/plate/react";
import { serializeHtml } from "@udecode/plate";
import { PlateStatic } from "../../../../components/Editor/util/serializeToHtml";
// import { useMemo } from "react";

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

export interface TextFormValues {
  type: "text";
  title: string;
  introduction: string;
  description: string;
}

export const TextForm = () => {
  const { validationT } = useValidationTranslation();
  const { setValue, control, getValues } = useFormContext<TextFormValues>();
  const editor = useRichTextEditor();

  return (
    <>
      <Controller
        control={control}
        name="title"
        rules={{
          required: validationT({
            type: "required",
            field: "title",
          }),
          maxLength: {
            value: TITLE_MAX_LENGTH,
            message: validationT({
              type: "maxLength",
              field: "title",
              vars: { count: TITLE_MAX_LENGTH },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message} required>
            <FieldLabel>{t("myNdla.learningpath.form.content.text.title.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.title.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        name="introduction"
        control={control}
        rules={{
          required: validationT({
            type: "required",
            field: "introduction",
          }),
          maxLength: {
            value: INTRODUCTION_MAX_LENGTH,
            message: validationT({
              type: "maxLength",
              field: "introduction",
              vars: { count: INTRODUCTION_MAX_LENGTH },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message} required>
            <FieldLabel>{t("myNdla.learningpath.form.content.text.introduction.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.introduction.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field?.value?.length ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: validationT({
            type: "required",
            field: "description",
          }),
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message} required>
            <FieldLabel onClick={() => document.getElementById("markdown-editor")?.focus()}>
              {t("myNdla.learningpath.form.content.text.description.label")}
            </FieldLabel>
            <Plate
              editor={editor}
              onValueChange={async () => {
                const serialized = await serializeHtml(editor, {
                  components: richTextEditorComponents,
                  stripClassNames: true,
                  editorComponent: PlateStatic,
                  stripDataAttributes: true,
                });
                console.log(serialized);
              }}
              // onValueChange={(val) => {
              //   console.log(serializeHtml(editor, val));
              // }}
            >
              <RichTextEditor />
            </Plate>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.description.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            {/* <Suspense fallback={<Spinner />}> */}
            {/*   <MarkdownEditor */}
            {/*     setContentWritten={(val) => { */}
            {/*       setValue("description", val, { */}
            {/*         shouldDirty: true, */}
            {/*       }); */}
            {/*     }} */}
            {/*     initialValue={field.value} */}
            {/*     {...field} */}
            {/*   /> */}
            {/* </Suspense> */}
          </FieldRoot>
        )}
      />
    </>
  );
};
