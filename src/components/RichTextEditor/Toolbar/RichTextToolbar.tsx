/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Bold, Italic, ListOrdered, ListUnordered } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { BULLETED_LIST_SHORTCUT, NUMBERED_LIST_SHORTCUT } from "../plugins/list/listShortcuts";
import { ListToolbarButton } from "../plugins/list/ListToolbarButton";
import { BOLD_SHORTCUT, ITALIC_SHORTCUT } from "../plugins/mark/markShortcuts";
import { MarkToolbarButton } from "../plugins/mark/MarkToolbarButton";

const ToolbarContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    paddingInline: "3xsmall",
    paddingBlock: "3xsmall",
    border: "1px solid",
    borderBottom: "none",
    borderTopRadius: "xsmall",
    borderColor: "stroke.subtle",
    backgroundColor: "surface.actionSubtle.hover",
  },
});

export const RichTextToolbar = () => {
  return (
    <ToolbarContainer>
      <MarkToolbarButton mark="bold" shortcut={BOLD_SHORTCUT}>
        <Bold />
      </MarkToolbarButton>
      <MarkToolbarButton mark="italic" shortcut={ITALIC_SHORTCUT}>
        <Italic />
      </MarkToolbarButton>
      <ListToolbarButton listType="bulleted-list" shortcut={BULLETED_LIST_SHORTCUT}>
        <ListUnordered />
      </ListToolbarButton>
      <ListToolbarButton listType="numbered-list" shortcut={NUMBERED_LIST_SHORTCUT}>
        <ListOrdered />
      </ListToolbarButton>
    </ToolbarContainer>
  );
};
