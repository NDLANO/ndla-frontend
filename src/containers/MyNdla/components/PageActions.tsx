/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MenuItemElement, MenuItemProps } from "./SettingsMenu";

const PageActionsContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
  },
});

interface Props {
  actions: MenuItemProps[];
}

export const PageActions = ({ actions }: Props) => {
  if (!actions.length) return null;
  return (
    <PageActionsContainer>
      {actions.map((action, index) => (
        <Button
          key={action.value}
          variant={index === 0 ? "secondary" : "tertiary"}
          disabled={action.disabled}
          size="small"
          asChild={action.type !== "action"}
          onClick={action.onClick}
        >
          <MenuItemElement item={action}>
            {action.icon}
            {action.text}
          </MenuItemElement>
        </Button>
      ))}
    </PageActionsContainer>
  );
};
