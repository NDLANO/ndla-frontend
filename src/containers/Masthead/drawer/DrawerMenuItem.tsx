/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SafeLink, { SafeLinkProps } from '@ndla/safelink';
import { ButtonV2 } from '@ndla/button';
import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { colors, fonts, spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { DrawerListItem } from './DrawerPortion';

interface BaseProps {
  bold?: boolean;
  type: 'button' | 'link';
  className?: string;
  active?: boolean;
  id: string;
  current?: boolean;
}

interface DrawerMenuButtonProps extends BaseProps {
  type: 'button';
  onClick: (expanded: boolean) => void;
  children?: ReactNode;
}

interface DrawerMenuLinkProps extends BaseProps, Omit<SafeLinkProps, 'id'> {
  type: 'link';
  onClose?: () => void;
}

const commonStyle = css`
  width: 100%;
  padding: ${spacing.xsmall} ${spacing.small};
  margin: 0 ${spacing.small};
  background-color: transparent;
  border: 0;
  border-radius: 5px;
  color: ${colors.brand.primary};
  text-align: start;
  box-shadow: none;
  cursor: pointer;
  :last-of-type {
    margin: ${spacing.xsmall} ${spacing.small};
  }
  &:hover {
    text-decoration: underline;
  }
`;

const boldItemStyle = css`
  font-weight: ${fonts.weight.bold};
  ${fonts.sizes('24px', '32px')};
  ${commonStyle};
`;

const normalItemStyle = css`
  ${fonts.sizes('18px', '32px')};
  ${commonStyle};
`;

interface StyledButtonProps {
  active?: boolean;
}

const activeStyle = css`
  background-color: ${colors.brand.primary};
  color: ${colors.white};
  svg {
    color: currentColor !important;
  }
`;

const shouldForwardProp = (prop: string) => prop !== 'active';

const StyledButton = styled(ButtonV2, { shouldForwardProp })<StyledButtonProps>`
  ${p =>
    p.active &&
    css`
      background-color: ${colors.brand.primary};
      color: ${colors.white};
    `}
`;

const TextWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${spacing.xsmall};
  span {
    color: ${colors.brand.primary};
  }
  text-decoration: none;
`;

type Props = DrawerMenuButtonProps | DrawerMenuLinkProps;

const DrawerMenuItem = ({
  bold,
  children,
  className,
  active,
  current,
  id,
  ...specificProps
}: Props) => {
  const style = bold ? boldItemStyle : normalItemStyle;
  if (specificProps.type === 'button') {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledButton
          tabIndex={-1}
          role="menuitem"
          aria-current={current}
          aria-owns={`list-${id}`}
          aria-expanded={!!active}
          id={id}
          onClick={() => specificProps.onClick(!!active)}
          css={[style, active ? activeStyle : []]}
          className={className}>
          <TextWrapper>
            {children}
            {current && <span aria-hidden={true}>•</span>}
          </TextWrapper>
        </StyledButton>
      </DrawerListItem>
    );
  } else {
    return (
      <DrawerListItem role="none" data-list-item>
        <SafeLink
          tabIndex={-1}
          role="menuitem"
          id={id}
          aria-current={current ? 'page' : undefined}
          to={specificProps.to}
          onClick={specificProps.onClose}
          className={className}
          css={[style, active ? activeStyle : []]}>
          <TextWrapper>
            {children}
            {current && <span aria-hidden={true}>•</span>}
          </TextWrapper>
        </SafeLink>
      </DrawerListItem>
    );
  }
};

export default DrawerMenuItem;
