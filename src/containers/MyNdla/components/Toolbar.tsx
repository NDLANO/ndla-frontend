import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { ReactNode } from 'react';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${colors.brand.lighter};
  border-left: 1px solid ${colors.brand.lighter};
  padding: ${spacing.small} ${spacing.large};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};

  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
  }
`;

const DropdownWrapper = styled.div`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

interface Props {
  buttons?: ReactNode[];
  dropDownMenu?: ReactNode;
}

const Toolbar = ({ buttons, dropDownMenu, ...rest }: Props) => {
  return (
    <ToolbarContainer {...rest}>
      <ButtonContainer>{buttons}</ButtonContainer>
      <DropdownWrapper>{dropDownMenu}</DropdownWrapper>
      <ButtonV2>Notifikasjon</ButtonV2>
    </ToolbarContainer>
  );
};

export default Toolbar;
