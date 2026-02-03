/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import { hasNodeOfType, isSpanElement, SPAN_ELEMENT_TYPE } from "@ndla/editor";
import { CheckLine, ArrowDownShortLine, CloseLine } from "@ndla/icons";
import {
  SelectRoot,
  SelectTrigger,
  SelectItemText,
  SelectItemIndicator,
  SelectContent,
  SelectItem,
  SelectHiddenSelect,
  Button,
  SelectValueText,
  SelectIndicator,
  SelectControl,
  SelectClearTrigger,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { defaultSpanBlock, languages } from "./utils";

interface LanguageItem {
  value: (typeof languages)[number];
  label: string;
}

const StyledSelectTrigger = styled(SelectTrigger, {
  base: {
    minWidth: "surface.4xsmall",
    width: "unset",
  },
});

const getCurrentLanguage = (editor: Editor) => {
  const [currentBlock] =
    Editor.nodes(editor, {
      match: isSpanElement,
      mode: "lowest",
    }) ?? [];
  const node = currentBlock?.[0];
  if (!isSpanElement(node)) return;
  return node.data.lang;
};

export const LanguageToolbarSelect = () => {
  const { t } = useTranslation();
  const editor = useSlate();
  const selection = useSlateSelection();
  const currentLanguage = useSlateSelector(getCurrentLanguage);

  const [match] = editor.nodes({ match: isSpanElement });
  const label = t("richTextEditor.plugin.span.language");

  const collection = useMemo(
    () =>
      createListCollection({
        items: languages.map((lang) => ({
          value: lang,
          label: t(`languages.${lang}`),
        })),
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
      }),
    [t],
  );

  const handleLanguageSelect = useCallback(
    (details: SelectValueChangeDetails<LanguageItem>) => {
      if (!selection) return;

      const wrappedInSpan = hasNodeOfType(editor, SPAN_ELEMENT_TYPE);
      const language = details.value[0];
      if (wrappedInSpan && language === undefined) {
        Transforms.unwrapNodes(editor, {
          match: isSpanElement,
        });
      } else if (wrappedInSpan) {
        const data = { dir: language === "ar" ? "rtl" : undefined, lang: language };
        Transforms.setNodes(editor, { data }, { match: isSpanElement });
      } else if (!wrappedInSpan && !Range.isCollapsed(selection)) {
        Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language, dir: language === "ar" ? "rtl" : undefined }), {
          at: Editor.unhangRange(editor, selection),
          split: true,
        });
      }

      ReactEditor.focus(editor);
    },
    [editor, selection],
  );

  return (
    <SelectRoot
      collection={collection}
      onValueChange={handleLanguageSelect}
      value={currentLanguage ? [currentLanguage] : []}
    >
      <SelectControl>
        <StyledSelectTrigger disabled={!selection || Range.isCollapsed(selection)} asChild>
          <Button size="small" variant="tertiary" data-state={match ? "on" : "off"} aria-label={label} title={label}>
            <SelectValueText placeholder={label} />
            <SelectIndicator>
              <ArrowDownShortLine />
            </SelectIndicator>
          </Button>
        </StyledSelectTrigger>
        <SelectClearTrigger asChild>
          <IconButton variant="tertiary" size="small">
            <CloseLine />
          </IconButton>
        </SelectClearTrigger>
      </SelectControl>
      <SelectContent>
        {collection.items.map((item) => (
          <SelectItem key={item.value} item={item}>
            <SelectItemText>{item.label}</SelectItemText>
            <SelectItemIndicator>
              <CheckLine />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};
