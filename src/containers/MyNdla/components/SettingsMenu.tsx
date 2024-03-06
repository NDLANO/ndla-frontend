/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, MouseEvent, useState, useCallback, useRef, RefObject } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { IconButtonV2, ButtonV2 } from "@ndla/button";
import { breakpoints, colors, fonts, misc, mq, spacing } from "@ndla/core";
import { DropdownMenu, DropdownItem, DropdownContent, DropdownTrigger } from "@ndla/dropdown-menu";
import { HorizontalMenu } from "@ndla/icons/contentType";
import { Drawer, Modal, ModalBody, ModalCloseButton, ModalHeader, ModalTrigger } from "@ndla/modal";
import { SafeLinkButton } from "@ndla/safelink";

export interface MenuItemProps {
  icon?: ReactNode;
  text?: string;
  disabled?: boolean;
  type?: "danger" | "primary";
  isModal?: boolean;
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
  keepOpen?: boolean;
  ref?: RefObject<HTMLButtonElement>;
  modalContent?: (close: VoidFunction, setSkipAutoFocus: VoidFunction) => ReactNode;
  modality?: boolean;
  link?: string;
}

interface Props {
  menuItems?: MenuItemProps[];
  modalHeader?: string;
}

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 20%;
  }
`;

const StyledListItem = styled.li`
  padding: 0;
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.ul`
  padding: 0;
  list-style: none;
`;

const StyledModalBody = styled(ModalBody)`
  padding: 0 0 ${spacing.large} 0px;
`;

const StyledListItemMobile = styled.li`
  border-bottom: 1px solid ${colors.brand.neutral7};
  padding: 0;
`;

const StyledDropdownContent = styled(DropdownContent)`
  &[hidden] {
    display: none;
  }
`;

const DropdownTriggerButton = styled(IconButtonV2)`
  min-width: 44px;
  min-height: 44px;
  margin: 0;
  padding: 0;
  &:hover,
  &:focus,
  &:focus-visible,
  &:focus-within {
    border-color: transparent;
    background-color: transparent;
    svg {
      background-color: ${colors.brand.light};
      border-radius: 50%;
    }
  }
`;

const ItemButton = styled(ButtonV2)`
  display: flex;
  align-items: center;
  color: ${colors.text.primary};
  ${fonts.sizes(spacing.nsmall, spacing.nsmall)}
  justify-content: flex-start;
  &[data-type="danger"] {
    color: ${colors.support.red};
    &:hover,
    &:focus-within,
    &:focus,
    &:focus-visible {
      color: ${colors.white};
    }
  }

  &[data-type="primary"] {
    color: ${colors.brand.primary};
  }
`;

export const linkCss = css`
  color: ${colors.text.primary};
  padding: ${spacing.xxsmall} ${spacing.xsmall};
  display: flex;
  justify-content: flex-start;
  font-weight: normal;
  min-height: 32px;
  ${fonts.sizes(spacing.nsmall, spacing.nsmall)}
`;

const SettingsMenu = ({ menuItems, modalHeader }: Props) => {
  const [open, setOpen] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);
  const [skipAutoFocus, setSkipAutoFocus] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { t } = useTranslation();

  const handleDialogItemOpenChange = (open: boolean, keepOpen?: boolean) => {
    setHasOpenModal(open);
    if (!open && !keepOpen) {
      setOpen(false);
    }
  };

  const close = useCallback(() => setOpen(false), []);

  const title = t("myNdla.showEditOptions");

  if (isMobile || isTablet) {
    return (
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <IconButtonV2
            title={title}
            aria-label={title}
            colorTheme="light"
            variant="ghost"
            disabled={!menuItems?.length}
            ref={dropdownTriggerRef}
          >
            <HorizontalMenu />
          </IconButtonV2>
        </ModalTrigger>
        <StyledDrawer
          expands
          position="bottom"
          size="small"
          hidden={hasOpenModal}
          onCloseAutoFocus={(event) => {
            setHasOpenModal(false);
            if (skipAutoFocus) {
              event.preventDefault();
              setSkipAutoFocus(false);
            } else if (dropdownTriggerRef.current) {
              event.preventDefault();
              dropdownTriggerRef.current.focus();
            }
          }}
        >
          <ModalHeader>
            <h1>{modalHeader ?? t("myNdla.settings")}</h1>
            <ModalCloseButton />
          </ModalHeader>
          <StyledModalBody>
            {!!menuItems?.length && (
              <StyledList>
                {menuItems.map((item) => (
                  <StyledListItemMobile key={item.text}>
                    <Item
                      keepOpen={item.keepOpen}
                      handleDialogItemOpenChange={handleDialogItemOpenChange}
                      isModal={item.isModal}
                      modalContent={item.modalContent}
                      modality={item.modality}
                      setSkipAutoFocus={() => setSkipAutoFocus(true)}
                    >
                      <ButtonV2
                        fontWeight="normal"
                        variant="ghost"
                        colorTheme={item.type}
                        ref={item.ref}
                        onClick={(e) => {
                          if (item.onClick) {
                            close();
                            item.onClick(e);
                          }
                        }}
                      >
                        {item.icon}
                        {item.text}
                      </ButtonV2>
                    </Item>
                  </StyledListItemMobile>
                ))}
              </StyledList>
            )}
          </StyledModalBody>
        </StyledDrawer>
      </Modal>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownTrigger>
        <DropdownTriggerButton
          title={title}
          aria-label={title}
          colorTheme="light"
          variant="ghost"
          disabled={!menuItems?.length}
          ref={dropdownTriggerRef}
        >
          <HorizontalMenu />
        </DropdownTriggerButton>
      </DropdownTrigger>
      <StyledDropdownContent
        showArrow
        side="bottom"
        align="end"
        hidden={hasOpenModal}
        forceMount
        onCloseAutoFocus={(event) => {
          setHasOpenModal(false);
          if (skipAutoFocus) {
            event.preventDefault();
            setSkipAutoFocus(false);
          } else if (dropdownTriggerRef.current) {
            event.preventDefault();
            dropdownTriggerRef.current?.focus();
          }
        }}
      >
        <StyledList>
          {menuItems?.map((item) => (
            <Item
              key={item.text}
              handleDialogItemOpenChange={handleDialogItemOpenChange}
              isModal={item.isModal}
              modalContent={item.modalContent}
              keepOpen={item.keepOpen}
              modality={item.modality}
              setSkipAutoFocus={() => setSkipAutoFocus(true)}
            >
              <DropdownItem
                asChild
                onSelect={(e) => {
                  if (!item.onClick) {
                    e.preventDefault();
                  }
                }}
              >
                {item.link ? (
                  <SafeLinkButton
                    tabIndex={-1}
                    role="menuitem"
                    key={item.text}
                    css={linkCss}
                    variant="ghost"
                    colorTheme="lighter"
                    to={item.link}
                    aria-label={item.text}
                  >
                    {item.icon}
                    {item.text}
                  </SafeLinkButton>
                ) : (
                  <ItemButton
                    colorTheme={item.type === "danger" ? "danger" : "light"}
                    disabled={item.disabled}
                    shape="sharp"
                    variant="ghost"
                    size="small"
                    fontWeight="normal"
                    data-type={item.type}
                    onClick={item.onClick}
                    ref={item.ref}
                  >
                    {item.icon}
                    {item.text}
                  </ItemButton>
                )}
              </DropdownItem>
            </Item>
          ))}
        </StyledList>
      </StyledDropdownContent>
    </DropdownMenu>
  );
};

interface ItemProps extends Pick<MenuItemProps, "isModal" | "modalContent" | "keepOpen" | "modality"> {
  children?: ReactNode;
  handleDialogItemOpenChange?: (open: boolean, keepOpen?: boolean) => void;
  setSkipAutoFocus: VoidFunction;
}

const Item = ({
  handleDialogItemOpenChange,
  setSkipAutoFocus,
  modality = true,
  modalContent,
  keepOpen,
  children,
  isModal,
}: ItemProps) => {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    handleDialogItemOpenChange?.(false, keepOpen);
    setOpen(false);
  }, [handleDialogItemOpenChange, keepOpen]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      handleDialogItemOpenChange?.(open);
      setOpen(open);
    },
    [handleDialogItemOpenChange],
  );

  if (!isModal || !modalContent) {
    return <StyledListItem>{children}</StyledListItem>;
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} modal={modality}>
      <ModalTrigger>
        <StyledListItem>{children}</StyledListItem>
      </ModalTrigger>
      {modalContent(close, setSkipAutoFocus)}
    </Modal>
  );
};
export default SettingsMenu;
