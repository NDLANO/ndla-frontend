/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";
import SkipToMainContent from "./SkipToMainContent";
import { BannerAlerts } from "../../../components/BannerAlerts";

const MastheadContent = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBlock: "small",
    paddingInline: "medium",
    gap: "xsmall",
    textAlign: "center",
    tabletDown: {
      padding: "small",
    },
  },
});

const StyledMasthead = styled("header", {
  base: {
    background: "surface.default",
    zIndex: "banner",
    boxShadow: "inner",

    "@media screen and (max-resolution: 3x)": {
      top: 0,
      position: "sticky",
      _print: { position: "relative" },
    },
  },
});

interface Props {
  children?: ReactNode;
  skipToMainContentId?: string;
  showAlerts?: boolean;
}

export const Masthead = ({ children, skipToMainContentId, showAlerts }: Props) => {
  return (
    <StyledMasthead id="masthead">
      {!!skipToMainContentId && <SkipToMainContent skipToMainContentId={skipToMainContentId} />}
      {!!showAlerts && <BannerAlerts />}
      <MastheadContent>{children}</MastheadContent>
    </StyledMasthead>
  );
};

export default Masthead;
