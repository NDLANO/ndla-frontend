/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent, useState, useCallback, useRef, type Ref } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { MoreLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
  Heading,
  IconButton,
  MenuContent,
  MenuItem,
  MenuItemVariantProps,
  MenuRoot,
  MenuTrigger,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../../components/DialogCloseButton";

interface BaseMenuItem {
  value: string;
  icon?: ReactNode;
  text?: string;
  disabled?: boolean;
  variant?: NonNullable<MenuItemVariantProps>["variant"];
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
}

interface LinkMenuItem extends BaseMenuItem {
  type: "link";
  link: string;
}

interface ButtonMenuItem extends BaseMenuItem {
  type: "action";
  onClick: (e?: MouseEvent<HTMLElement>) => void;
}

export interface DialogMenuItem extends BaseMenuItem {
  type: "dialog";
  modalContent: (close: VoidFunction) => ReactNode;
}

export type MenuItemProps = LinkMenuItem | ButtonMenuItem | DialogMenuItem;

interface Props {
  menuItems?: MenuItemProps[];
  modalHeader?: string;
  elementSize?: "small" | "medium";
}

const StyledDialogContent = styled(DialogContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    maxHeight: "100%",
    borderTopRadius: "xsmall!",
    paddingBlockEnd: "medium",
    tabletDown: {
      minHeight: "20%",
    },
  },
});

const StyledDialogTrigger = styled(DialogTrigger, {
  base: {
    desktop: {
      display: "none",
    },
  },
});

const StyledMenuTrigger = styled(MenuTrigger, {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    paddingInline: "xsmall",
    "& a, button": {
      display: "flex",
      justifyContent: "flex-start",
      width: "100%",
    },
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    paddingBlockStart: "0",
    paddingInline: "0",
  },
});

const SettingsMenu = ({ menuItems, modalHeader, elementSize = "medium" }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();

  const handleDialogItemOpenChange = (open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      setMenuOpen(false);
    }
  };

  const close = useCallback(() => {
    setDialogOpen(false);
    setMenuOpen(false);
  }, []);

  const title = t("myNdla.showEditOptions");

  const items = menuItems?.map((item) => (
    <li key={item.value}>
      <Button
        disabled={item.disabled}
        variant={item.variant === "destructive" ? "danger" : "tertiary"}
        size={elementSize}
        asChild={item.type !== "action"}
        onClick={(e) => {
          if (item.onClick) {
            item.onClick(e);
            if (item.type !== "dialog") {
              close();
            }
          }
        }}
      >
        <MenuItemElement item={item} handleDialogItemOpenChange={handleDialogItemOpenChange}>
          {item.icon}
          {item.text}
        </MenuItemElement>
      </Button>
    </li>
  ));

  return (
    <>
      <DialogRoot
        open={dialogOpen}
        variant="dialog"
        position="bottom"
        onOpenChange={(details) => setDialogOpen(details.open)}
      >
        <StyledDialogTrigger asChild ref={dropdownTriggerRef}>
          <IconButton title={title} aria-label={title} variant="tertiary" disabled={!menuItems?.length}>
            <MoreLine />
          </IconButton>
        </StyledDialogTrigger>
        <StyledDialogContent>
          <DialogHeader>
            <Heading textStyle="heading.small">{modalHeader ?? t("myNdla.settings")}</Heading>
            <DialogCloseButton />
          </DialogHeader>
          <StyledDialogBody>{!!menuItems?.length && <StyledList>{items}</StyledList>}</StyledDialogBody>
        </StyledDialogContent>
      </DialogRoot>
      <MenuRoot
        open={menuOpen}
        positioning={{ placement: "bottom-end", strategy: "fixed" }}
        onOpenChange={(details) => setMenuOpen(details.open)}
      >
        <StyledMenuTrigger asChild ref={dropdownTriggerRef}>
          <IconButton title={title} aria-label={title} variant="clear" disabled={!menuItems?.length} size={elementSize}>
            <MoreLine />
          </IconButton>
        </StyledMenuTrigger>
        <MenuContent>
          {menuItems?.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              variant={item.variant}
              onClick={item.onClick}
              disabled={item.disabled}
              closeOnSelect={item.type !== "dialog"}
              asChild={item.type !== "action"}
              consumeCss
            >
              <MenuItemElement
                item={item}
                handleDialogItemOpenChange={handleDialogItemOpenChange}
                dropdownTriggerRef={dropdownTriggerRef}
              >
                {item.icon}
                {item.text}
              </MenuItemElement>
            </MenuItem>
          ))}
        </MenuContent>
      </MenuRoot>
    </>
  );
};

interface ItemProps {
  children?: ReactNode;
  handleDialogItemOpenChange?: (open: boolean) => void;
  item: MenuItemProps;
  dropdownTriggerRef?: Ref<HTMLButtonElement>;
}

export const MenuItemElement = ({
  handleDialogItemOpenChange,
  children,
  item,
  dropdownTriggerRef,
  ...rest
}: ItemProps) => {
  const [open, setOpen] = useState(false);

  const onOpenChange = useCallback(
    (open: boolean) => {
      handleDialogItemOpenChange?.(open);
      setOpen(open);
    },
    [handleDialogItemOpenChange],
  );

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  if (item.type === "link") {
    return (
      <SafeLink unstyled to={item.link} {...rest}>
        {children}
      </SafeLink>
    );
  }

  if (item.type === "action") {
    return children;
  }

  return (
    <DialogRoot
      open={open}
      onOpenChange={(details) => onOpenChange(details.open)}
      finalFocusEl={
        dropdownTriggerRef && "current" in dropdownTriggerRef ? () => dropdownTriggerRef.current : undefined
      }
    >
      <DialogTrigger css={{ all: "unset" }} {...rest}>
        {children}
      </DialogTrigger>
      <Portal>{item.modalContent(close)}</Portal>
    </DialogRoot>
  );
};
export default SettingsMenu;
