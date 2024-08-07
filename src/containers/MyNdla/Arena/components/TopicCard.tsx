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
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    borderWidth: "1px",
    boxShadow: "none",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    justifyContent: "space-between",
    padding: "medium",
    paddingLeft: "xxlarge",
    paddingRight: "large",

    _focusVisible: {
      backgroundColor: "surface.brand.2.moderate",
      "& [data-name='hover']": {
        textDecoration: "none",
      },
    },
    _hover: {
      backgroundColor: "surface.brand.2.moderate",
      "& [data-name='hover']": {
        textDecoration: "none",
      },
    },
  },
});

const StyledHeader = styled(Text, {
  base: {
    color: "text.strong",
    cursor: "pointer",
    fontSize: "small",
    overflowWrap: "break-word",
    textDecoration: "underline",
  },
});

const StyledText = styled(Text, {
  base: {
    color: "text.primary",
    fontSize: "xxsmall",
    paddingTop: "3xsmall",
  },
});

const StyledCountContainer = styled("div", {
  base: {
    alignItems: "center",
    color: "text.primary",
    display: "flex",
    flexDirection: "column",
  },
});

const StyledLockedIcon = styled(LockFill, {
  base: {
    color: "stroke.default",
    height: "medium",
    width: "medium",
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
        <StyledHeader data-name="hover">{title}</StyledHeader>
        <StyledText>{timestamp && formatDateTime(timestamp, i18n.language)}</StyledText>
      </div>
      <StyledCountContainer>
        {locked ? (
          <StyledLockedIcon />
        ) : (
          <CountContainer aria-label={`${count} ${t("myNdla.arena.topic.responses")}`}>
            <Text textStyle="body.medium" aria-hidden>
              {count}
            </Text>
            <StyledText aria-hidden>{t("myNdla.arena.topic.responses")}</StyledText>
          </CountContainer>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
