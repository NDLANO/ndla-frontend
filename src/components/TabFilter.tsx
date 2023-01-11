/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';

interface StyledProps {
  selected: boolean;
}

const StyledLi = styled.li`
  margin: 0;
`;

const StyledButton = styled(ButtonV2)<StyledProps>`
  border-width: 1px;
  border-radius: ${spacing.xsmall};
  border-color: ${colors.brand.dark};
  ${({ selected }) =>
    !selected &&
    css`
      background: ${colors.white};
      color: ${colors.brand.dark};
      border-color: ${colors.brand.light};
    `};
`;

const ButtonContainer = styled.ul`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  border-radius: 12px;
  background: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.lighter};
  align-self: flex-start;
  margin: ${spacing.normal} 0 ${spacing.small};
  list-style: none;
`;

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

const TabFilter = ({ value: selectedValue, onChange, options }: Props) => {
  const { t } = useTranslation();
  return (
    <ButtonContainer aria-label={t('subjectsPage.filterSubjects')}>
      {options.map(({ value, label }) => (
        <StyledLi role="none" key={value}>
          <StyledButton
            role="listitem"
            fontWeight="bold"
            aria-current={selectedValue === value}
            selected={selectedValue === value}
            variant={selectedValue === value ? undefined : 'outline'}
            onClick={() => onChange(value)}>
            {label}
          </StyledButton>
        </StyledLi>
      ))}
    </ButtonContainer>
  );
};

export default TabFilter;
