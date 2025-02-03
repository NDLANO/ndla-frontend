/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Editor, Node, Range } from "slate";
import { useSlate } from "slate-react";
import { useDialogContext } from "@ark-ui/react";
import { isElementOfType, isLinkElement } from "@ndla/editor";
import { LinkMedium } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  IconButton,
} from "@ndla/primitives";
import { DialogCloseButton } from "../../DialogCloseButton";

export const AnchorToolbarButton = () => {
  const [initialValue, setInitialValue] = useState<UrlFormValues | undefined>(undefined);
  const editor = useSlate();

  const [match] = editor.nodes({ match: isLinkElement });

  return (
    <DialogRoot onExitComplete={() => setInitialValue(undefined)}>
      <DialogTrigger
        asChild
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setInitialValue(toInitialValue(match?.[0], editor))}
      >
        <IconButton size="small" variant="tertiary" data-state={match ? "on" : "off"}>
          <LinkMedium />
        </IconButton>
      </DialogTrigger>
      {!!initialValue && <AnchorDialogContent initialValue={initialValue} />}
    </DialogRoot>
  );
};

interface AnchorDialogContentProps {
  initialValue?: UrlFormValues;
}

const toInitialValue = (node: Node | undefined, editor: Editor) => {
  return {
    url: isElementOfType(node, "link") ? node.data.href : "",
    text: isElementOfType(node, "link") ? Node.string(node) : editor.selection ? editor.string(editor.selection) : "",
  };
};

interface UrlFormValues {
  url: string;
  text: string;
}

const updateNode = (editor: Editor, values: UrlFormValues) => {
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

export const AnchorDialogContent = ({ initialValue }: AnchorDialogContentProps) => {
  const editor = useSlate();
  const dialogContext = useDialogContext();
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm({ defaultValues: initialValue });

  const onSave: SubmitHandler<UrlFormValues> = useCallback(
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
        {/* TODO: Variance and i18n */}
        <DialogTitle>Link</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <form onSubmit={handleSubmit(onSave)} noValidate>
        <DialogBody>
          <Controller
            control={control}
            name="text"
            render={({ field, fieldState }) => (
              <FieldRoot invalid={!!fieldState.error?.message}>
                <FieldLabel>Text</FieldLabel>
                <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
                <FieldInput {...field} />
              </FieldRoot>
            )}
          />
          <Controller
            control={control}
            name="url"
            render={({ field, fieldState }) => (
              <FieldRoot invalid={!!fieldState.error?.message}>
                <FieldLabel>URL</FieldLabel>
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
