/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { CloseLine } from "@ndla/icons";
import { IconButton, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useAlerts } from "./AlertsContext";

const MessageBannerWrapper = styled("div", {
  base: {
    background: "surface.brand.4.moderate",
    display: "grid",
    gridTemplateAreas: "'. content closebutton'",
    gridTemplateColumns: "minmax(30px, 1fr) minmax(0, auto) minmax(30px, 1fr)",
  },
});
const StyledCloseButton = styled(IconButton, {
  base: {
    gridArea: "closebutton",
    justifySelf: "flex-end",
    alignSelf: "center",
  },
});

const StyledText = styled(Text, {
  base: {
    paddingBlock: "xsmall",
    gridArea: "content",
  },
});

export const BannerAlerts = () => {
  const { t } = useTranslation();
  const { openAlerts, closeAlert } = useAlerts();

  if (!openAlerts?.length) {
    return null;
  }

  const alerts = openAlerts?.map((alert) => ({
    content: alert.body ? parse(alert.body) : alert.title,
    closable: alert.closable,
    number: alert.number,
  }));

  return (
    <>
      {alerts.map((message) => (
        <MessageBannerWrapper key={message.number}>
          <StyledText textStyle="body.large">{message.content}</StyledText>
          {!!message.closable && (
            <StyledCloseButton
              variant="clear"
              onClick={() => closeAlert(message.number)}
              aria-label={t("close")}
              title={t("close")}
            >
              <CloseLine />
            </StyledCloseButton>
          )}
        </MessageBannerWrapper>
      ))}
    </>
  );
};
