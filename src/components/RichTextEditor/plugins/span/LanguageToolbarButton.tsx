/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import { hasNodeOfType, isSpanElement, SPAN_ELEMENT_TYPE } from "@ndla/editor";
import { GlobalLine, CheckLine } from "@ndla/icons";
import {
  IconButton,
  IconButtonProps,
  SelectRoot,
  SelectTrigger,
  SelectItemText,
  SelectItemIndicator,
  SelectContent,
  SelectItem,
  SelectHiddenSelect,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { defaultSpanBlock } from "./utils";

const StyledSelectTrigger = styled(SelectTrigger, {
  base: {
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
  if (!Element.isElement(node) || node.type !== SPAN_ELEMENT_TYPE) return;
  return node.data.lang;
};

interface Props extends IconButtonProps {
  languages: string[];
}

export const LanguageToolbarButton = ({ languages, ...rest }: Props) => {
  const { t } = useTranslation();
  const editor = useSlate();
  const selection = useSlateSelection();
  const currentLanguage = useSlateSelector(getCurrentLanguage);

  const [match] = editor.nodes({ match: isSpanElement });
  const tooltip = t("richTextEditor.plugin.span.languageTooltip");

  const collection = createListCollection({
    items: languages,
    itemToString: (item) => t(`languages.${item}`),
  });

  const handleLanguageSelect = (details: SelectValueChangeDetails<string>) => {
    if (!selection) return;
    const language = details.value[0];
    Transforms.select(editor, selection);
    ReactEditor.focus(editor);
    const wrappedInSpan = hasNodeOfType(editor, SPAN_ELEMENT_TYPE);
    if (wrappedInSpan && language === undefined) {
      Transforms.unwrapNodes(editor, {
        match: isSpanElement,
      });
    } else if (language === undefined) {
      return;
    } else if (!wrappedInSpan) {
      Transforms.wrapNodes(editor, defaultSpanBlock({ lang: language, dir: language === "ar" ? "rtl" : undefined }), {
        at: Editor.unhangRange(editor, selection),
        split: true,
      });
    } else {
      const data = { dir: language === "ar" ? "rtl" : undefined, lang: language };
      Transforms.setNodes(editor, { data }, { match: isSpanElement });
    }
  };

  return (
    <SelectRoot
      collection={collection}
      onValueChange={handleLanguageSelect}
      value={currentLanguage ? [currentLanguage] : []}
    >
      <StyledSelectTrigger disabled={!selection} asChild>
        <IconButton
          size="small"
          variant="tertiary"
          data-state={match ? "on" : "off"}
          {...rest}
          aria-label={rest["aria-label"] ?? tooltip}
          title={rest.title ?? tooltip}
        >
          <GlobalLine />
        </IconButton>
      </StyledSelectTrigger>
      <SelectContent>
        {collection.items.map((lang) => (
          <SelectItem key={lang} item={lang}>
            <SelectItemText>{t(`languages.${lang}`)}</SelectItemText>
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
