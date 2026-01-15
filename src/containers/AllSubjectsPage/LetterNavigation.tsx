/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

const subjectLetters = [
  "#",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "Æ",
  "Ø",
  "Å",
];

const LetterNavigationWrapper = styled("ul", {
  base: {
    display: "flex",
    listStyle: "none",
    flexWrap: "wrap",
    flex: 1,
    gap: "xxsmall",
    tabletWideDown: {
      gap: "medium",
    },
  },
});

const StyledLetter = styled(SafeLinkIconButton, {
  base: {
    borderRadius: "0px",
    boxShadow: "0px 2px -0px 0px var(--shadow-color)",
    transitionProperty: "all",
    transitionDuration: "superFast",
    transitionTimingFunction: "emphasized-in-out",
    _hover: {
      borderRadius: "xsmall",
      boxShadow: "0 0 0 1px var(--shadow-color)",
      background: "surface.actionSubtle.hover",
      _disabled: {
        background: "none",
        boxShadow: "none",
      },
    },
    _focusVisible: {
      borderRadius: "xsmall",
      boxShadow: "0 0 0 1px var(--shadow-color)",
      background: "surface.actionSubtle.active",
    },
    _disabled: {
      background: "none",
      boxShadow: "none",
    },
    tabletWideDown: {
      minWidth: "xxlarge",
      minHeight: "xxlarge",
    },
  },
});

interface Props {
  activeLetters: string[];
}

export const LetterNavigation = ({ activeLetters }: Props) => {
  const { t } = useTranslation();
  return (
    <LetterNavigationWrapper aria-label={t("subjectsPage.scrollToGroup")}>
      {subjectLetters.map((letter) => {
        const enabled = activeLetters.includes(letter);
        return (
          <li key={letter}>
            <StyledLetter
              to={`#subject-header-${letter}`}
              size="small"
              variant="secondary"
              disabled={!enabled}
              tabIndex={enabled ? 0 : -1}
              aria-label={`${t("subjectsPage.scrollToGroup")} "${letter === "#" ? t("labels.other") : letter}"`}
            >
              <Text textStyle="body.small" fontWeight="bold" color={enabled ? "primary" : "text.disabled"}>
                {letter}
              </Text>
            </StyledLetter>
          </li>
        );
      })}
    </LetterNavigationWrapper>
  );
};
