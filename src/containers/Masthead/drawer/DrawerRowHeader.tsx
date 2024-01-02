/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { ForwardArrow, RightArrow } from '@ndla/icons/action';
import { SafeLinkButton } from '@ndla/safelink';
import { DrawerListItem } from './DrawerPortion';

interface BaseProps {
  id?: string;
  title: string;
  icon?: ReactNode;
  active?: boolean;
  tabIndex?: number;
  type: 'link' | 'button';
  current?: boolean;
}

interface ButtonProps extends BaseProps {
  type: 'button';
  onClick: () => void;
  ownsId: string;
}

interface LinkProps extends BaseProps {
  type: 'link';
  to: string;
  onClose: () => void;
}

type Props = ButtonProps | LinkProps;

const headerSpacing = `${spacing.small} ${spacing.nsmall} ${spacing.small} ${spacing.normal}`;

const rowHeaderWrapperStyles = css`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: ${headerSpacing};
  color: ${colors.brand.primary};
  ${fonts.sizes('20px', '24px')};
  font-weight: ${fonts.weight.semibold};
  background-color: #f7fafd;
  border: 0px;
  svg {
    min-width: 24px;
    min-height: 24px;
    width: 24px;
    height: 24px;
  }
  border-bottom: 1px solid ${colors.brand.neutral7};
  border-radius: 0px;
  &:hover,
  &:focus {
    border: 0px;
    border-bottom: 1px solid ${colors.brand.neutral7};
  }
`;

const StyledButton = styled(ButtonV2)`
  ${rowHeaderWrapperStyles};
  text-align: start;
`;

const StyledLink = styled(SafeLinkButton)`
  ${rowHeaderWrapperStyles};
`;

const IconTitleWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
  justify-content: center;
`;

const DrawerRowHeader = ({ title, icon, active, id, current, ...rest }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const contents = (
    <IconTitleWrapper>
      {icon}
      {title}
    </IconTitleWrapper>
  );

  if (rest.type === 'button') {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledButton
          tabIndex={-1}
          aria-owns={rest.ownsId}
          role="menuitem"
          aria-expanded={expanded}
          aria-current={current ? 'page' : undefined}
          colorTheme="light"
          onClick={() => {
            setExpanded(true);
            rest.onClick();
          }}
          id={`header-${id}`}
        >
          {contents}
          <RightArrow />
        </StyledButton>
      </DrawerListItem>
    );
  } else {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledLink
          aria-current={current ? 'page' : undefined}
          tabIndex={-1}
          role="menuitem"
          to={rest.to}
          onClick={rest.onClose}
          id={`header-${id}`}
        >
          {contents}
          <ForwardArrow />
        </StyledLink>
      </DrawerListItem>
    );
  }
};

export default DrawerRowHeader;
