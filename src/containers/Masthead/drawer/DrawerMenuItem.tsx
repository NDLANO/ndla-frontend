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

interface BaseProps {
  bold?: boolean;
  type: 'button' | 'link';
  className?: string;
}

interface DrawerMenuButtonProps extends BaseProps {
  type: 'button';
  onClick: () => void;
  children?: ReactNode;
}

interface DrawerMenuLinkProps extends BaseProps, SafeLinkProps {
  type: 'link';
  onClose?: () => void;
}

const commonStyle = css`
  padding: ${spacing.xsmall};
  background-color: transparent;
  border: 0;
  color: ${colors.brand.primary};
  text-align: start;
  box-shadow: none;
  cursor: pointer;
  &:hover {
    box-shadow: inset 0 -1px;
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

type Props = DrawerMenuButtonProps | DrawerMenuLinkProps;

const DrawerMenuItem = ({
  bold,
  children,
  className,
  ...specificProps
}: Props) => {
  const style = bold ? boldItemStyle : normalItemStyle;
  if (specificProps.type === 'button') {
    return (
      <ButtonV2
        onClick={specificProps.onClick}
        css={style}
        className={className}>
        {children}
      </ButtonV2>
    );
  } else {
    return (
      <SafeLink
        to={specificProps.to}
        onClick={specificProps.onClose}
        className={className}
        css={style}>
        {children}
      </SafeLink>
    );
  }
};

export default DrawerMenuItem;
