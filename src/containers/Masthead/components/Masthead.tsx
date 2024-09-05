/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons/action";
import { IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SkipToMainContent from "./SkipToMainContent";

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

    "&[data-fixed=true]": { top: 0, position: "sticky", _print: { position: "relative" } },
  },
});

const MessageBannerWrapper = styled("div", {
  base: {
    background: "surface.brand.4.moderate",
    display: "grid",
    gridTemplateAreas: "'. content closebutton'",
    gridTemplateColumns: "minmax(30px, 1fr) minmax(0, auto) minmax(30px, 1fr)",
  },
});
const StyledCloseButton = styled(IconButton, {
  base: { gridArea: "closebutton", justifySelf: "flex-end", alignSelf: "center" },
});

const StyledText = styled(Text, { base: { paddingBlock: "xsmall", gridArea: "content" } });

interface Alert {
  content: ReactNode;
  closable?: boolean;
  number: number;
}

interface Props {
  children?: ReactNode;
  fixed?: boolean;
  skipToMainContentId?: string;
  messages?: Alert[];
  onCloseAlert?: (id: number) => void;
}

export const Masthead = ({ children, fixed, skipToMainContentId, messages, onCloseAlert }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledMasthead data-fixed={!!fixed} id="masthead">
      {skipToMainContentId && <SkipToMainContent skipToMainContentId={skipToMainContentId} />}
      {messages?.map((message) => (
        <MessageBannerWrapper key={message.number}>
          <StyledText textStyle="body.large">{message.content}</StyledText>
          {message.closable && (
            <StyledCloseButton
              variant="clear"
              onClick={() => onCloseAlert?.(message.number)}
              aria-label={t("close")}
              title={t("close")}
            >
              <CloseLine />
            </StyledCloseButton>
          )}
        </MessageBannerWrapper>
      ))}
      <MastheadContent>{children}</MastheadContent>
    </StyledMasthead>
  );
};

export default Masthead;
