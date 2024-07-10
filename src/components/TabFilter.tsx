/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";

const StyledLi = styled.li`
  padding: 0;
`;

const StyledButton = styled(ButtonV2)`
  border-width: 1px;
  border-radius: 12px;
  border-color: ${colors.brand.dark};
  :not(:hover, :focus)[aria-current="false"] {
    background: ${colors.white};
    color: ${colors.brand.dark};
    border-color: ${colors.brand.light};
  }
`;

const ButtonContainer = styled.ul`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  border-radius: ${spacing.small};
  background: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.lighter};
  align-self: flex-start;
  margin: ${spacing.normal} 0 ${spacing.small};
  list-style: none;
  flex-wrap: wrap;
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
    <ButtonContainer aria-label={t("subjectsPage.filterSubjects")}>
      {/* TODO: Should probably not be buttons */}
      {options.map(({ value, label }) => (
        <StyledLi role="none" key={value}>
          <StyledButton
            role="listitem"
            fontWeight="bold"
            aria-current={selectedValue === value}
            variant={selectedValue === value ? undefined : "outline"}
            onClick={() => onChange(value)}
          >
            {label}
          </StyledButton>
        </StyledLi>
      ))}
    </ButtonContainer>
  );
};

export default TabFilter;
