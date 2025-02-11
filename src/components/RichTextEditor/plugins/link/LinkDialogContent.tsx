/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Editor, Node, Range } from "slate";
import { useSlate } from "slate-react";
import { useDialogContext } from "@ark-ui/react";
import { isElementOfType, isLinkElement } from "@ndla/editor";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "@ndla/primitives";
import { URL_REGEX } from "../../../../util/urlHelper";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import { DialogCloseButton } from "../../../DialogCloseButton";

interface LinkDialogContentProps {
  initialValue?: LinkFormValues;
}

export interface LinkFormValues {
  url: string;
  text: string;
}

export const toInitialLinkFormValues = (node: Node | undefined, editor: Editor): LinkFormValues => {
  return {
    url: isElementOfType(node, "link") ? node.data.href : "",
    text: isElementOfType(node, "link") ? Node.string(node) : editor.selection ? editor.string(editor.selection) : "",
  };
};

const updateNode = (editor: Editor, values: LinkFormValues) => {
  const { selection } = editor;
  if (!selection) return;
  const [linkEntry] = editor.nodes({ match: isLinkElement });

  // we're updating an existing link
  if (linkEntry) {
    editor.insertText(values.text, { at: linkEntry[1] });
    editor.setNodes({ data: { href: values.url } }, { at: linkEntry[1], match: isLinkElement });
  } else if (Range.isCollapsed(selection)) {
    // we're inserting a link without having preselected text
    editor.insertNodes({ type: "link", data: { href: values.url }, children: [{ text: values.text }] });
  } else {
    editor.wrapNodes({ type: "link", data: { href: values.url }, children: [] }, { split: true });
  }
};

export const LinkDialogContent = ({ initialValue }: LinkDialogContentProps) => {
  const editor = useSlate();
  const dialogContext = useDialogContext();
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();

  const { control, handleSubmit } = useForm({ defaultValues: initialValue, mode: "onSubmit" });

  const onSave: SubmitHandler<LinkFormValues> = useCallback(
    (values) => {
      if (!editor.selection) return;
      dialogContext.setOpen(false);
      // if we don't wait for the dialog to close, focus will not work properly.
      // It's moved into its own function to avoid wrapping every single transform in a setTimeout
      setTimeout(() => updateNode(editor, values));
    },
    [dialogContext, editor],
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t(`richTextEditor.plugin.link.${initialValue?.url.length ? "edit" : "create"}`)}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <form onSubmit={handleSubmit(onSave)} noValidate>
        <DialogBody>
          <Controller
            control={control}
            name="text"
            rules={{
              required: validationT({
                type: "required",
                field: "title",
              }),
            }}
            render={({ field, fieldState }) => (
              <FieldRoot invalid={!!fieldState.error?.message}>
                <FieldLabel>{t("richTextEditor.plugin.link.form.textLabel")}</FieldLabel>
                <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
                <FieldInput {...field} />
              </FieldRoot>
            )}
          />
          <Controller
            control={control}
            name="url"
            rules={{
              required: validationT({
                type: "required",
                field: "url",
              }),
              validate: (value) => value.match(URL_REGEX) || t("validation.properUrl"),
            }}
            render={({ field, fieldState }) => (
              <FieldRoot invalid={!!fieldState.error?.message}>
                <FieldLabel>{t("richTextEditor.plugin.link.form.urlLabel")}</FieldLabel>
                <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
                <FieldInput {...field} />
              </FieldRoot>
            )}
          />
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger asChild>
            <Button variant="secondary">{t("close")}</Button>
          </DialogCloseTrigger>
          <Button type="submit" onMouseDown={(e) => e.preventDefault()}>
            {t("save")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
