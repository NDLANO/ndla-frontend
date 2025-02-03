/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Bold, Italic, ListOrdered, ListUnordered } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { AnchorToolbarButton } from "./AnchorToolbarButton";
import { ListToolbarButton } from "./ListToolbarButton";
import { MarkToolbarButton } from "./MarkToolbarButton";

const ToolbarContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    paddingInline: "3xsmall",
    paddingBlock: "3xsmall",
    borderBottom: "1px solid",
    borderTopRadius: "xsmall",
    borderColor: "stroke.subtle",
    backgroundColor: "surface.actionSubtle.hover",
  },
});

export const RichTextToolbar = () => {
  return (
    <ToolbarContainer>
      <MarkToolbarButton mark="bold">
        <Bold />
      </MarkToolbarButton>
      <MarkToolbarButton mark="italic">
        <Italic />
      </MarkToolbarButton>
      <ListToolbarButton listType="bulleted-list">
        <ListUnordered />
      </ListToolbarButton>
      <ListToolbarButton listType="numbered-list">
        <ListOrdered />
      </ListToolbarButton>
      <AnchorToolbarButton />
    </ToolbarContainer>
  );
};
