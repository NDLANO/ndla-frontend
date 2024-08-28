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
  postCount: number;
  voteCount: number;
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

    _hover: {
      backgroundColor: "surface.hover",
      "& [data-title]": {
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

const StyledCountContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: "small",
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
    gap: "3xsmall",
  },
});

const TitleContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const TopicCard = ({ id, title, locked, timestamp, postCount, voteCount }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledSafelink to={routes.myNdla.arenaTopic(id)}>
      <TitleContainer>
        <StyledHeader data-title="" textStyle="title.small" color="text.strong">
          {title}
        </StyledHeader>
        <Text textStyle="label.small">{timestamp && formatDateTime(timestamp, i18n.language)}</Text>
      </TitleContainer>
      <StyledCountContainer>
        {locked ? (
          <StyledLockedIcon />
        ) : (
          <>
            <CountContainer aria-label={`${postCount} ${t("myNdla.arena.topic.responses")}`}>
              <Text textStyle="body.medium" aria-hidden color="text.strong">
                {postCount}
              </Text>
              <Text aria-hidden textStyle="label.small">
                {t("myNdla.arena.topic.responses")}
              </Text>
            </CountContainer>
            <CountContainer aria-label={`${voteCount} ${t("myNdla.arena.topic.responses")}`}>
              <Text textStyle="body.medium" aria-hidden color="text.strong">
                {voteCount}
              </Text>
              <Text aria-hidden textStyle="label.small">
                {t("myNdla.arena.topic.responses")}
              </Text>
            </CountContainer>
          </>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
