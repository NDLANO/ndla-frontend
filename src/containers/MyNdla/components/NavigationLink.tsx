/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useLocation } from "react-router";
import { ExternalLinkLine } from "@ndla/icons";
import { SafeLink, SafeLinkButtonProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { MyNdlaButton } from "./MyNdlaButton";
import { routes } from "../../../routeHelpers";

export const MoreButton = styled(MyNdlaButton, {
  base: {
    mobileWide: {
      display: "none",
    },
  },
});

const LongText = styled("span", {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const ShortText = styled("span", {
  base: {
    desktop: {
      display: "none",
    },
  },
});

const StyledExternalLinkLine = styled(ExternalLinkLine, {
  base: {
    width: "small!",
    height: "small!",
  },
});

const ExternalWrapper = styled("span", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4xsmall",
  },
});

interface Props extends Omit<SafeLinkButtonProps, "children"> {
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
  to: string;
}

export const NavigationLink = ({ icon, iconFilled, name, shortName, onClick, to, reloadDocument }: Props) => {
  const location = useLocation();
  const selected =
    to === routes.myNdla.root ? location.pathname === routes.myNdla.root : location.pathname.startsWith(to);
  const selectedIcon = selected ? (iconFilled ?? icon) : icon;
  const external = to.startsWith("http");

  return (
    <MyNdlaButton asChild>
      <SafeLink
        unstyled
        aria-current={selected ? "page" : undefined}
        to={to}
        reloadDocument={reloadDocument}
        onClick={onClick}
        target={external ? "_blank" : undefined}
      >
        {selectedIcon}
        <LongText>{name}</LongText>
        {external ? (
          <ExternalWrapper>
            <ShortText>{shortName}</ShortText>
            <StyledExternalLinkLine />
          </ExternalWrapper>
        ) : (
          <ShortText>{shortName}</ShortText>
        )}
      </SafeLink>
    </MyNdlaButton>
  );
};
