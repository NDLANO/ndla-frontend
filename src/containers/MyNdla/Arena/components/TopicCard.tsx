/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { ChatHeartFill, ChatHeartLine, LockFill } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { routes } from "../../../../routeHelpers";
import formatDate from "../../../../util/formatDate";

interface Props {
  id: number;
  title: string;
  timestamp: string;
  postCount: number;
  voteCount: number;
  locked?: boolean;
  category?: string;
}
const StyledSafelink = styled(SafeLink, {
  base: {
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.default",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    justifyContent: "space-between",
    padding: "small",

    "& [data-hover-icon]": {
      display: "none",
    },

    _hover: {
      backgroundColor: "surface.hover",
      "& [data-title]": {
        textDecoration: "none",
      },
      "& [data-normal-icon]": {
        display: "none",
      },
      "& [data-hover-icon]": {
        display: "block",
      },
    },

    tabletWideDown: {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "3xsmall",
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
    justifyContent: "flex-end",
    minWidth: "surface.4xsmall",
    tabletWideDown: {
      marginInlineStart: "xlarge",
    },
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
    minWidth: "3xlarge",
    tabletWideDown: {
      minWidth: "xxlarge",
    },
  },
});

const TitleContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const TitleWrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: "small",
  },
});

const TopicCard = ({ id, title, locked, timestamp, postCount, voteCount, category }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledSafelink to={routes.myNdla.arenaTopic(id)}>
      <TitleWrapper>
        <ChatHeartLine data-normal-icon="" />
        <ChatHeartFill data-hover-icon="" />
        <TitleContainer>
          <StyledHeader data-title="">{title}</StyledHeader>
          <Text textStyle="label.small">
            {category && `${category} | `}
            {timestamp && formatDate(timestamp, i18n.language)}
          </Text>
        </TitleContainer>
      </TitleWrapper>
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
            <CountContainer
              aria-label={`${voteCount} ${t(`myNdla.arena.topic.vote${voteCount === 1 ? "Singular" : "Plural"}`)}`}
            >
              <Text textStyle="body.medium" aria-hidden color="text.strong">
                {voteCount}
              </Text>
              <Text aria-hidden textStyle="label.small">
                {t(`myNdla.arena.topic.vote${voteCount === 1 ? "Singular" : "Plural"}`)}
              </Text>
            </CountContainer>
          </>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
