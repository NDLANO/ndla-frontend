/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType, ReactNode, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms, Range } from "slate";
import { ReactEditor, useSlate, useSlateSelection, useSlateSelector } from "slate-react";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import { PARAGRAPH_ELEMENT_TYPE, toggleHeading } from "@ndla/editor";
import { platformSpecificTooltip } from "@ndla/editor-components";
import { ArrowDownShortLine, CheckLine } from "@ndla/icons";
import {
  Button,
  SelectContent,
  SelectControl,
  SelectHiddenSelect,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FontWeightToken } from "@ndla/styled-system/tokens";
import { TextType } from "./headingTypes";
import { getHotKey } from "./headingUtils";

interface HeadingProps {
  title: string;
  fontWeight?: FontWeightToken;
}

interface HeadingSpanProps extends HeadingProps {
  children: ReactNode;
}

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "baseline",
    textStyle: "body.medium",
    gap: "3xsmall",
  },
});

const StyledText = styled(Text, {
  base: {
    width: "medium",
    height: "medium",
  },
});

const HeadingSpan = ({ children, ...rest }: HeadingSpanProps) => {
  return (
    <StyledText {...rest} consumeCss asChild>
      <span>{children}</span>
    </StyledText>
  );
};

const Paragraph = (props: HeadingProps) => <HeadingSpan {...props}>P</HeadingSpan>;
const HeadingTwo = (props: HeadingProps) => <HeadingSpan {...props}>H2</HeadingSpan>;
const HeadingThree = (props: HeadingProps) => <HeadingSpan {...props}>H3</HeadingSpan>;

const iconMapping: Record<TextType, ElementType> = {
  "heading-2": HeadingTwo,
  "heading-3": HeadingThree,
  "normal-text": Paragraph,
};

const getTextValue = (editor: Editor): TextType => {
  const [match] = editor.selection
    ? Editor.nodes(editor, {
        at: editor.selection,
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        mode: "lowest",
      })
    : [];
  const node = match?.[0];
  if (!node || !Element.isElement(node)) {
    return "normal-text";
  }
  return node.type === "heading" ? (`heading-${node.level}` as TextType) : "normal-text";
};

const StyledSelectTrigger = styled(SelectTrigger, {
  base: {
    minWidth: "surface.4xsmall",
    width: "unset",
  },
});

export const HeadingToolbarSelect = () => {
  const { t } = useTranslation();
  const editor = useSlate();
  const currentTextValue = useSlateSelector(getTextValue);
  const selection = useSlateSelection();

  const TriggerIcon = useMemo(() => (currentTextValue ? iconMapping[currentTextValue] : undefined), [currentTextValue]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: [
          { value: "normal-text", label: t("richTextEditor.plugin.heading.normal-text") },
          { value: "heading-2", label: t("richTextEditor.plugin.heading.heading-2") },
          { value: "heading-3", label: t("richTextEditor.plugin.heading.heading-3") },
        ],
        itemToValue: (item) => item.value,
        itemToString: (item) => item.label,
      }),
    [t],
  );

  const onHeadingOptionClick = useCallback(
    (details: SelectValueChangeDetails) => {
      if (!selection) return;
      Transforms.select(editor, selection);
      ReactEditor.focus(editor);
      const textVariant = details.value[0];
      if (textVariant === "normal-text") {
        Transforms.setNodes(editor, { type: PARAGRAPH_ELEMENT_TYPE }, { at: selection });
      } else if (textVariant === "heading-2") {
        toggleHeading(editor, 2);
      } else if (textVariant === "heading-3") {
        toggleHeading(editor, 3);
      }
    },
    [editor, selection],
  );

  return (
    <SelectRoot
      collection={collection}
      onValueChange={onHeadingOptionClick}
      value={currentTextValue ? [currentTextValue] : []}
    >
      <SelectControl>
        <SelectLabel srOnly>{t("richTextEditor.plugin.heading.label")}</SelectLabel>
        <StyledSelectTrigger disabled={!selection || Range.isCollapsed(selection)} asChild>
          <Button size="small" variant="tertiary" title={t("richTextEditor.plugin.heading.label")}>
            {!!TriggerIcon && <TriggerIcon fontWeight="semibold" />}
            <SelectValueText placeholder={t(`richTextEditor.plugin.heading.${currentTextValue}`)} />
            <SelectIndicator>
              <ArrowDownShortLine />
            </SelectIndicator>
          </Button>
        </StyledSelectTrigger>
      </SelectControl>
      <SelectContent>
        {collection.items.map((item) => {
          const Icon = item.value ? iconMapping[item.value as TextType] : undefined;
          return (
            <SelectItem
              key={item.value}
              item={item}
              aria-label={`${item.label} (${platformSpecificTooltip(getHotKey(item.value as TextType))})`}
              title={platformSpecificTooltip(getHotKey(item.value as TextType))}
            >
              <TextWrapper>
                {!!Icon && <Icon />}
                <SelectItemText>{item.label}</SelectItemText>
              </TextWrapper>
              <SelectItemIndicator>
                <CheckLine />
              </SelectItemIndicator>
            </SelectItem>
          );
        })}
      </SelectContent>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};
