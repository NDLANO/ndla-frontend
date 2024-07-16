/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { subjectLetters } from "./utils";

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

const StyledLetter = styled("a", {
  base: {
    height: 17,
    width: 17,
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    outline: "none",
    borderRadius: 0,
    boxShadowColor: "stroke.default",
    // TODO: Box shadow looks weird in Chrome mobile emulation
    boxShadow: "0px 2px -0px 0px var(--shadow-color)",
    _hover: {
      borderRadius: "xsmall",
      boxShadow: "0 0 0 1px var(--shadow-color)",
      background: "surface.actionSubtle.hover",
    },
    _focusVisible: {
      borderRadius: "xsmall",
      boxShadow: "0 0 0 1px var(--shadow-color)",
      background: "surface.actionSubtle.active",
    },
    _active: {
      background: "surface.actionSubtle.active",
    },
    "&[aria-disabled='true']": {
      cursor: "not-allowed",
      boxShadow: "none",
      _hover: { boxShadow: "none", background: "none" },
    },
    tabletWideDown: {
      minWidth: "xxlarge",
      minHeight: "xxlarge",
    },
  },
});

const StyledLi = styled("li", {
  base: {
    padding: 0,
  },
});

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
              aria-disabled={!enabled}
              tabIndex={enabled ? 0 : -1}
              aria-label={`${t("subjectsPage.scrollToGroup")} "${letter}"`}
            >
              <Text textStyle="body.small" fontWeight="bold" color={enabled ? "primary" : "text.disabled"}>
                {letter}
              </Text>
            </StyledLetter>
          </StyledLi>
        );
      })}
    </LetterNavigationWrapper>
  );
};

export default LetterNavigation;
