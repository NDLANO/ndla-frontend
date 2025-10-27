/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MenuModalContent } from "./MenuModalContent";
import { SettingsMenu, MenuItemElement, MenuItemProps } from "./SettingsMenu";

const ToolbarContainer = styled("div", {
  base: {
    borderBottomColor: "stroke.subtle",
    borderBottom: "1px solid",
    display: "none",
    justifyContent: "center",
    minHeight: "fit-content",
    paddingBlock: "small",

    mobileWide: {
      display: "flex",
    },

    "&[data-visible='false']": {
      display: "none !important",
    },
  },
});

const StyledButtonList = styled("ul", {
  base: {
    display: "none",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "4xsmall",
    listStyle: "none",
    margin: "0",
    padding: "0",

    tablet: {
      display: "flex",
    },
  },
});

const SettingsMenuWrapper = styled("div", {
  base: {
    display: "none",
    mobileWideToTablet: {
      display: "unset",
    },
  },
});

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexGrow: "1",
    justifyContent: "space-between",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    width: "100%",
  },
});

interface Props {
  menuItems?: MenuItemProps[];
  showButtons?: boolean;
}

export const Toolbar = ({ menuItems, showButtons }: Props) => {
  const { t } = useTranslation();

  return (
    <ToolbarContainer data-visible={!!menuItems?.length}>
      <StyledPageContent>
        <Wrapper>
          <div>
            <StyledButtonList>
              {menuItems?.map((item) => (
                <li key={item.value}>
                  <Button
                    disabled={item.disabled}
                    variant={item.variant === "destructive" ? "danger" : "tertiary"}
                    size="small"
                    asChild={item.type !== "action"}
                    onClick={(e) => {
                      if (item.onClick) {
                        item.onClick(e);
                      }
                    }}
                  >
                    <MenuItemElement item={item}>
                      {item.icon}
                      {item.text}
                    </MenuItemElement>
                  </Button>
                </li>
              ))}
            </StyledButtonList>
            {!!menuItems?.length && (
              <SettingsMenuWrapper>
                <SettingsMenu menuItems={menuItems} modalHeader={t("myNdla.tools")} elementSize="small" />
              </SettingsMenuWrapper>
            )}
          </div>
        </Wrapper>
      </StyledPageContent>
      <MenuModalContent menuItems={menuItems} showButtons={showButtons} />
    </ToolbarContainer>
  );
};
