/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { ChatHeartFill, ChatHeartLine, LockFill } from "@ndla/icons/common";
import { ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
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

const StyledListItemContent = styled(ListItemContent, {
  base: {
    tabletWideDown: {
      alignItems: "flex-start",
      flexDirection: "column",
      gap: "3xsmall",
    },
  },
});

const TopicCard = ({ id, title, locked, timestamp, postCount, voteCount, category }: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledSafelink to={routes.myNdla.arenaTopic(id)}>
      <ListItemRoot variant="list">
        <StyledListItemContent>
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
        </StyledListItemContent>
      </ListItemRoot>
    </StyledSafelink>
  );
};

export default TopicCard;
