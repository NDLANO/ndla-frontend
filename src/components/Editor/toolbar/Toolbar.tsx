/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BoldPlugin, ItalicPlugin } from "@udecode/plate-basic-marks/react";
import { BulletedListPlugin, NumberedListPlugin } from "@udecode/plate-list/react";
import { Bold, Italic, LinkMedium, ListOrdered, ListUnordered } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { LinkToolbarButton } from "./LinkToolbarButton";
import { ListToolbarButton } from "./ListToolbarButton";
import { MarkToolbarButton } from "./MarkToolbarButton";

const ToolbarContainer = styled("div", {
  base: {
    display: "flex",
    padding: "3xsmall",
    gap: "5xsmall",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    background: "background.subtle",
    borderTopRadius: "xsmall",
  },
});

export const Toolbar = () => {
  return (
    <ToolbarContainer>
      <MarkToolbarButton nodeType={BoldPlugin.key}>
        <Bold />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={ItalicPlugin.key}>
        <Italic />
      </MarkToolbarButton>
      <ListToolbarButton nodeType={BulletedListPlugin.key}>
        <ListUnordered />
      </ListToolbarButton>
      <ListToolbarButton nodeType={NumberedListPlugin.key}>
        <ListOrdered />
      </ListToolbarButton>
      <LinkToolbarButton>
        <LinkMedium />
      </LinkToolbarButton>
    </ToolbarContainer>
  );
};
