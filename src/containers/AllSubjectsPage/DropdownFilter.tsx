/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors, fonts } from '@ndla/core';
import {
  Select,
  Option,
  ControlPropsType,
  OptionPropsType,
  IndicatorsContainerPropsType,
  MenuPropsType,
} from '@ndla/select';
import { useTranslation } from 'react-i18next';

const DropdownWrapper = styled.div`
  padding: ${spacing.xsmall};
  border-radius: 12px;
  background: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.lighter};
  margin: ${spacing.normal} 0 ${spacing.small};
`;

interface StyledControlProps {
  menuIsOpen: boolean;
}

const StyledControl = styled.div<StyledControlProps>`
  display: flex;
  gap: ${spacing.xxsmall};
  flex: 1;
  border: 1px solid ${colors.brand.light};
  background: ${colors.white};
  border-radius: ${spacing.xsmall};
  padding: ${spacing.small} ${spacing.normal};
  font-weight: ${fonts.weight.bold};
  color: ${colors.brand.primary};
  ${fonts.sizes('18px', '24px')};

  ${({ menuIsOpen }) =>
    menuIsOpen &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}
`;

interface StyledOptionProps {
  isSelected: boolean;
  isFocused: boolean;
}

const StyledOption = styled.div<StyledOptionProps>`
  ${fonts.sizes('18px', '24px')};
  color: ${colors.brand.primary};
  padding: ${spacing.small} ${spacing.normal};
  font-weight: ${fonts.weight.bold};

  ${({ isFocused, isSelected }) =>
    (isFocused || isSelected) &&
    css`
      background: ${isSelected ? colors.brand.lighter : colors.brand.lightest};
    `}
`;

const StyledIndicatorsContainer = styled.div`
  margin-left: auto;
  svg {
    color: ${colors.brand.primary};
    height: 22px;
    width: 22px;
  }
`;

const StyledMenu = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.brand.light};
  border-radius: ${spacing.xsmall};
  overflow: hidden;
  margin-top: ${spacing.xxsmall};
  & > div {
    padding: 0;
  }
`;

const CustomControl = ({
  children,
  innerRef,
  innerProps,
  menuIsOpen,
}: ControlPropsType<false>) => {
  const { t } = useTranslation();
  return (
    <StyledControl menuIsOpen={menuIsOpen} ref={innerRef} {...innerProps}>
      {`${t('subjectsPage.shows')}: `} {children}
    </StyledControl>
  );
};

const CustomMenu = ({
  children,
  innerRef,
  innerProps,
}: MenuPropsType<false>) => {
  return (
    <StyledMenu ref={innerRef} {...innerProps}>
      {children}
    </StyledMenu>
  );
};

const CustomOption = ({
  children,
  innerRef,
  innerProps,
  isSelected,
  isFocused,
}: OptionPropsType<false>) => {
  return (
    <StyledOption
      isFocused={isFocused}
      isSelected={isSelected}
      ref={innerRef}
      {...innerProps}>
      {children}
    </StyledOption>
  );
};

const CustomIndicatorsContainer = ({
  innerProps,
  children,
}: IndicatorsContainerPropsType<false>) => {
  return (
    <StyledIndicatorsContainer {...innerProps}>
      {children}
    </StyledIndicatorsContainer>
  );
};

interface Props {
  options: Option[];
  value: Option;
  onChange: (value: string) => void;
}

const DropdownFilter = ({ options, value, onChange }: Props) => {
  return (
    <DropdownWrapper>
      <Select<false>
        options={options}
        value={value}
        onChange={option => onChange(option?.value!)}
        ControlComponent={CustomControl}
        OptionComponent={CustomOption}
        MenuComponent={CustomMenu}
        IndicatorsContainerComponent={CustomIndicatorsContainer}
      />
    </DropdownWrapper>
  );
};

export default DropdownFilter;
