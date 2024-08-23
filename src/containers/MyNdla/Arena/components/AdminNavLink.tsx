/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  to: string;
  title: string;
  subText: string;
  rightText?: string;
  icon: ReactNode;
}

const StyledSafelink = styled(SafeLink, {
  base: {
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    padding: "medium",
    paddingInlineEnd: "large",

    _hover: {
      "& [data-name='hover']": {
        textDecoration: "none",
      },
    },

    mobileWide: {
      backgroundColor: "surface.default",
      _hover: {
        backgroundColor: "surface.infoSubtle",
      },
    },
  },
});

const SpacingContainer = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    justifyContent: "space-between",
    width: "100%",
  },
});

const StyledHeader = styled(Text, {
  base: {
    cursor: "pointer",
    textDecoration: "underline",
  },
});

const StyledDescriptionText = styled(Text, {
  base: {
    mobileWideDown: {
      display: "none",
    },
  },
});

const StyledCountContainer = styled("div", {
  base: {
    textAlign: "center",
  },
});

const NavWrapper = styled("li", {
  base: {
    listStyle: "none",
    margin: 0,
  },
});

const AdminNavLink = ({ to, title, subText, rightText, icon }: Props) => {
  return (
    <NavWrapper>
      <StyledSafelink to={to}>
        {icon}
        <SpacingContainer>
          <div>
            <StyledHeader data-name="hover" color="text.strong" asChild consumeCss>
              <label>{title}</label>
            </StyledHeader>
            <StyledDescriptionText>{subText}</StyledDescriptionText>
          </div>
          <StyledCountContainer>
            <Text>{rightText}</Text>
          </StyledCountContainer>
        </SpacingContainer>
      </StyledSafelink>
    </NavWrapper>
  );
};

export default AdminNavLink;
