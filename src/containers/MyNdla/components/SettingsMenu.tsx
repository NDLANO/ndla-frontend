/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ReactNode,
  MouseEvent,
  useState,
  useCallback,
  useRef,
  RefObject,
} from 'react';
import styled from '@emotion/styled';
import { isMobile, isTablet } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { IconButtonV2, ButtonV2 } from '@ndla/button';
import {
  Drawer,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTrigger,
} from '@ndla/modal';
import { HorizontalMenu } from '@ndla/icons/contentType';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import {
  DropdownMenu,
  DropdownItem,
  DropdownContent,
  DropdownTrigger,
} from '@ndla/dropdown-menu';

export interface MenuItemProps {
  icon?: ReactNode;
  text?: string;
  disabled?: boolean;
  type?: 'danger';
  isModal?: boolean;
  onClick?: (e?: MouseEvent<HTMLElement>) => void;
  keepOpen?: boolean;
  ref?: RefObject<HTMLButtonElement>;
  modalContent?: (close: VoidFunction) => ReactNode;
}

interface Props {
  menuItems?: MenuItemProps[];
  children?: ReactNode;
}

const StyledDrawer = styled(Drawer)`
  max-height: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 20%;
  }
`;

const StyledUl = styled.ul`
  padding: 0;
  list-style: none;
`;

const StyledModalBody = styled(ModalBody)`
  padding: 0 0 ${spacing.large} 0px;
`;

const StyledLi = styled.li`
  border-bottom: 1px solid ${colors.brand.neutral7};
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
  ${fonts.sizes('16px', '16px')};
  justify-content: flex-start;
  &[data-danger='true'] {
    color: ${colors.support.red};
    &:hover,
    &:focus-within,
    &:focus,
    &:focus-visible {
      color: ${colors.white};
    }
  }
`;

const SettingsMenu = ({ menuItems, children }: Props) => {
  const [open, setOpen] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement | null>(null);
  const { t } = useTranslation();

  const handleDialogItemOpenChange = (open: boolean, keepOpen?: boolean) => {
    setHasOpenModal(open);
    if (!open && !keepOpen) {
      setOpen(false);
    }
  };

  const close = useCallback(() => setOpen(false), []);

  if (isMobile || isTablet) {
    return (
      <Modal open={open} onOpenChange={setOpen}>
        <ModalTrigger>
          <IconButtonV2
            aria-label={t('myNdla.more')}
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
            event.preventDefault();
            dropdownTriggerRef.current?.focus();
            setHasOpenModal(false);
          }}
        >
          <ModalHeader>
            <h1>{t('myNdla.settings')}</h1>
            <ModalCloseButton />
          </ModalHeader>
          <StyledModalBody>
            {children}
            {!!menuItems?.length && (
              <StyledUl>
                {menuItems.map((item) => (
                  <StyledLi key={item.text}>
                    <Item
                      keepOpen={item.keepOpen}
                      handleDialogItemOpenChange={handleDialogItemOpenChange}
                      isModal={item.isModal}
                      modalContent={item.modalContent}
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
                  </StyledLi>
                ))}
              </StyledUl>
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
          aria-label={t('myNdla.more')}
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
          event.preventDefault();
          dropdownTriggerRef.current?.focus();
          setHasOpenModal(false);
        }}
      >
        {menuItems?.map((item) => (
          <Item
            key={item.text}
            handleDialogItemOpenChange={handleDialogItemOpenChange}
            isModal={item.isModal}
            modalContent={item.modalContent}
            keepOpen={item.keepOpen}
          >
            <DropdownItem
              asChild
              onSelect={(e) => {
                if (!item.onClick) {
                  e.preventDefault();
                }
              }}
            >
              <ItemButton
                colorTheme={item.type ?? 'light'}
                disabled={item.disabled}
                shape="sharp"
                variant="ghost"
                size="small"
                fontWeight="normal"
                data-danger={item.type === 'danger'}
                onClick={item.onClick}
                ref={item.ref}
              >
                {item.icon}
                {item.text}
              </ItemButton>
            </DropdownItem>
          </Item>
        ))}
      </StyledDropdownContent>
    </DropdownMenu>
  );
};

interface ItemProps
  extends Pick<MenuItemProps, 'isModal' | 'modalContent' | 'keepOpen'> {
  children?: ReactNode;
  handleDialogItemOpenChange?: (open: boolean, keepOpen?: boolean) => void;
}

const Item = ({
  children,
  handleDialogItemOpenChange,
  isModal,
  modalContent,
  keepOpen,
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
    return children;
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalTrigger>{children}</ModalTrigger>
      {modalContent(close)}
    </Modal>
  );
};
export default SettingsMenu;
