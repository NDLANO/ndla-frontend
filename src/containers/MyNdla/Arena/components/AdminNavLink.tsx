/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  to: string;
  title: string;
  subText: string;
  icon: ReactNode;
}

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    alignItems: "flex-start",
    textAlign: "left",
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    justifyContent: "flex-start",
    gap: "small",
    "& span": {
      textDecoration: "underline",
    },
    _hover: {
      "& span": {
        textDecoration: "none",
      },
    },
  },
});

const AdminNavLink = ({ to, title, subText, icon }: Props) => {
  return (
    <StyledSafeLinkButton variant="secondary" to={to}>
      {icon}
      <TextWrapper>
        <span>{title}</span>
        <Text>{subText}</Text>
      </TextWrapper>
    </StyledSafeLinkButton>
  );
};

export default AdminNavLink;
