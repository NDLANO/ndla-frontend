/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { LockFill } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { routes } from "../../../../routeHelpers";
import { formatDateTime } from "../../../../util/formatDate";

interface Props {
  id: number;
  title: string;
  timestamp: string;
  count: number;
  locked?: boolean;
}
const StyledSafelink = styled(SafeLink, {
  base: {
    alignItems: "center",
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    justifyContent: "space-between",
    paddingBlock: "medium",
    paddingInlineStart: "xxlarge",
    paddingInlineEnd: "large",

    _focusVisible: {
      backgroundColor: "surface.hover",
    },
    _hover: {
      backgroundColor: "surface.hover",
      "& [data-name='hover']": {
        textDecoration: "none",
      },
    },
  },
});

const StyledHeader = styled(Text, {
  base: {
    overflowWrap: "break-word",
    textDecoration: "underline",
  },
});

const StyledText = styled(Text, {
  base: {
    paddingTop: "3xsmall",
  },
});

const StyledCountContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
});

const StyledLockedIcon = styled(LockFill, {
  base: {
    color: "stroke.default",
  },
});

const CountContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
});

const TopicCard = ({ id, title, locked, timestamp, count }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledSafelink to={routes.myNdla.arenaTopic(id)}>
      <div>
        <StyledHeader data-name="hover" textStyle="title.small" color="text.strong">
          {title}
        </StyledHeader>
        <StyledText textStyle="body.small">{timestamp && formatDateTime(timestamp, i18n.language)}</StyledText>
      </div>
      <StyledCountContainer>
        {locked ? (
          <StyledLockedIcon />
        ) : (
          <CountContainer aria-label={`${count} ${t("myNdla.arena.topic.responses")}`}>
            <Text textStyle="body.medium" aria-hidden color="text.strong">
              {count}
            </Text>
            <StyledText aria-hidden textStyle="body.small">
              {t("myNdla.arena.topic.responses")}
            </StyledText>
          </CountContainer>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
