/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { buttonStyleV2 } from "@ndla/button";
import { breakpoints, colors, fonts, misc, mq, spacing } from "@ndla/core";
import { subjectLetters } from "./utils";

const LetterNavigationWrapper = styled.ul`
  display: flex;
  list-style: none;
  flex-wrap: wrap;
  flex: 1;
  gap: ${spacing.small};
  margin: ${spacing.medium} 0;
  ${mq.range({ until: breakpoints.tabletWide })} {
    gap: ${spacing.medium};
  }
  padding: 0;
`;

const StyledLi = styled.li`
  padding: 0;
`;

interface StyledProps {
  disabled?: boolean;
}

const StyledLetter = styled.a<StyledProps>`
  ${buttonStyleV2({ colorTheme: "lighter", variant: "ghost" })}
  ${fonts.sizes("18px", "24px")};
  font-weight: ${fonts.weight.bold};
  min-width: 20px;
  min-height: unset;
  padding: 0;
  box-shadow: inset 0 -1px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  &[disabled],
  &[disabled]:focus {
    background: none;
    box-shadow: none;
    outline: none;
    border: none;
    color: ${colors.brand.light};
    cursor: unset;
  }
  :hover,
  :focus {
    box-shadow: none;
    border-bottom-left-radius: ${misc.borderRadius};
    border-bottom-right-radius: ${misc.borderRadius};
  }
  :focus {
    background: ${colors.brand.primary};
    color: ${colors.white};
    outline: none;
    border-color: ${colors.brand.primary};
  }
  ${mq.range({ until: breakpoints.tabletWide })} {
    ${fonts.sizes("24px", "24px")};
    box-shadow: inset 0 -3px 0px -1px;
    min-height: 48px;
    min-width: 48px;
  }
`;

interface Props {
  activeLetters: string[];
}

const LetterNavigation = ({ activeLetters }: Props) => {
  const { t } = useTranslation();
  return (
    <LetterNavigationWrapper aria-label={t("subjectsPage.scrollToGroup")}>
      {subjectLetters.map((letter) => {
        const enabled = activeLetters.includes(letter);
        return (
          <StyledLi key={letter}>
            <StyledLetter
              href={enabled ? `#subject-header-${letter}` : undefined}
              disabled={!enabled}
              aria-disabled={!enabled}
              tabIndex={enabled ? 0 : -1}
              aria-label={`${t("subjectsPage.scrollToGroup")} "${letter === "#" ? t("labels.other") : letter}"`}
            >
              {letter}
            </StyledLetter>
          </StyledLi>
        );
      })}
    </LetterNavigationWrapper>
  );
};

export default LetterNavigation;
