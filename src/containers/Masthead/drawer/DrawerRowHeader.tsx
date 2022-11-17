import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { colors, spacing, spacingUnit } from '@ndla/core';
import { ForwardArrow, RightArrow } from '@ndla/icons/lib/action';
import { ButtonV2 } from '@ndla/button';
import { SafeLinkButton } from '@ndla/safelink';
import { css } from '@emotion/react';

interface BaseProps {
  title: string;
  icon?: ReactNode;
  active?: boolean;
  type: 'link' | 'button';
}

interface ButtonProps extends BaseProps {
  type: 'button';
  onClick: () => void;
}

interface LinkProps extends BaseProps {
  type: 'link';
  to: string;
  onClose: () => void;
}

type Props = ButtonProps | LinkProps;

const headerSpacing = `${spacing.small} ${spacingUnit * 1.5}px ${
  spacing.small
} ${spacing.normal}`;

const rowHeaderWrapperStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: ${headerSpacing};
  color: ${colors.brand.primary};
  background-color: #f7fafd;
  border: 0px;
  border-bottom: 1px solid ${colors.brand.neutral7};
  border-radius: 0px;
  &:hover {
    border-bottom: 1px solid ${colors.brand.neutral7};
    border: 0px;
  }
`;

const StyledButton = styled(ButtonV2)`
  ${rowHeaderWrapperStyles};
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

const DrawerRowHeader = ({ title, icon, active, ...rest }: Props) => {
  const contents = (
    <IconTitleWrapper>
      {icon}
      {title}
    </IconTitleWrapper>
  );

  if (rest.type === 'button') {
    return (
      <StyledButton colorTheme="light" onClick={rest.onClick}>
        {contents}
        <RightArrow />
      </StyledButton>
    );
  } else {
    return (
      <StyledLink to={rest.to} onClick={rest.onClose}>
        {contents}
        <ForwardArrow />
      </StyledLink>
    );
  }
};

export default DrawerRowHeader;
