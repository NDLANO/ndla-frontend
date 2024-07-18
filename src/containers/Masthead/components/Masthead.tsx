/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Cross } from "@ndla/icons/action";
import { IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SkipToMainContent from "./SkipToMainContent";

const MastheadContent = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "token(spacing.small) token(spacing.medium)",
    gap: "xsmall",

    tabletDown: {
      padding: "small",
    },
  },
});

const StyledMasthead = styled("div", {
  base: {
    background: "white",
    borderColor: "stroke.subtle",
    borderBottom: "1px solid",
    zIndex: "banner",

    "&[data-fixed=true]": { top: 0, position: "sticky", _print: { position: "relative" } },
  },
});

const MessageBannerWrapper = styled("div", {
  base: {
    background: "surface.brand.4.moderate",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    tabletDown: {
      padding: "small",
    },
  },
});

const StyledText = styled(Text, { base: { paddingBlock: "xsmall" } });

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
    <>
      {skipToMainContentId && <SkipToMainContent skipToMainContentId={skipToMainContentId} />}
      <StyledMasthead data-fixed={!!fixed} id="masthead">
        {messages?.map((message) => (
          <MessageBannerWrapper key={message.number}>
            <div />
            <StyledText textStyle="body.large">{message.content}</StyledText>
            <div>
              {message.closable && (
                <IconButton
                  variant="clear"
                  onClick={() => onCloseAlert?.(message.number)}
                  aria-label={t("close")}
                  title={t("close")}
                >
                  <Cross />
                </IconButton>
              )}
            </div>
          </MessageBannerWrapper>
        ))}
        <MastheadContent>{children}</MastheadContent>
      </StyledMasthead>
    </>
  );
};

export default Masthead;
