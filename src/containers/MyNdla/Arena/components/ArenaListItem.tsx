/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ComponentPropsWithRef, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Assign } from "@ark-ui/react";
import { ForumOutlined, LockFill, QuestionAnswerLine } from "@ndla/icons/common";
import { ListItemContent, ListItemHeading, ListItemProps, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { MyNDLAUserType } from "../../../../components/AuthenticationContext";
import { routes } from "../../../../routeHelpers";
import { formatDateTime } from "../../../../util/formatDate";

const StyledListItemContent = styled(ListItemContent, {
  base: {
    alignItems: "center",
    flexWrap: "wrap",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    gap: "small",
    width: "100%",
  },
  variants: {
    visible: {
      false: {
        background: "surface.disabled",
      },
    },
  },
});

const StyledLockedIcon = styled(LockFill, {
  base: {
    color: "stroke.default",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
  },
});

const NumberText = styled(Text, {
  base: {
    minWidth: "3xlarge",
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    textAlign: "center",
    tabletDown: {
      flexDirection: "row",
      minWidth: "unset",
    },
  },
});

const IconWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    minWidth: "3xlarge",
    tabletDown: {
      minWidth: "unset",
    },
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    lineClamp: "2",
    overflowWrap: "anywhere",
  },
});

const DescriptionWrapper = styled("div", {
  base: {
    display: "flex",
  },
});

const DescriptionText = styled(Text, {
  base: {
    "& + p": {
      position: "relative",
      paddingInlineStart: "xxsmall",
      marginInlineStart: "xxsmall",
      _after: {
        content: '"|"',
        fontSize: "1.2rem",
        position: "absolute",
        left: "-4xsmall",
      },
    },
  },
});

interface TopicListItemProps extends Omit<ComponentPropsWithRef<"div">, "id"> {
  id: number;
  title: string;
  locked?: boolean;
  postCount?: number;
  voteCount?: number;
  timestamp?: string;
  category?: string;
}

export const TopicListItem = forwardRef<HTMLDivElement, Assign<ListItemProps, TopicListItemProps>>(
  ({ id, title, timestamp, category, postCount, locked, voteCount, ...props }, ref) => {
    const { t, i18n } = useTranslation();
    return (
      <StyledListItemRoot {...props} colorTheme="brand3" ref={ref}>
        <StyledListItemContent>
          <ContentWrapper>
            <QuestionAnswerLine />
            <TextWrapper>
              <ListItemHeading asChild consumeCss>
                <StyledSafeLink to={routes.myNdla.arenaTopic(id)} unstyled css={linkOverlay.raw()}>
                  {title}
                </StyledSafeLink>
              </ListItemHeading>
              <DescriptionWrapper>
                {!!category && (
                  <DescriptionText textStyle="label.small" color="text.subtle">
                    {category}
                  </DescriptionText>
                )}
                {!!timestamp && (
                  <Text textStyle="label.small" color="text.subtle">
                    {formatDateTime(timestamp, i18n.language)}
                  </Text>
                )}
              </DescriptionWrapper>
            </TextWrapper>
          </ContentWrapper>
          {locked ? (
            <IconWrapper>
              <StyledLockedIcon />
            </IconWrapper>
          ) : postCount != null || voteCount != null ? (
            <ContentWrapper>
              {postCount != null && (
                <NumberText textStyle="label.small" aria-label={`${postCount} ${t("myNdla.arena.topic.responses")}`}>
                  <strong>{postCount}</strong>
                  {t("myNdla.arena.topic.responses")}
                </NumberText>
              )}
              {voteCount != null && (
                <NumberText
                  textStyle="label.small"
                  aria-label={`${voteCount} ${t("myNdla.arena.topic.votes", { count: voteCount })}`}
                >
                  <strong>{voteCount}</strong>
                  {t("myNdla.arena.topic.votes", { count: voteCount })}
                </NumberText>
              )}
            </ContentWrapper>
          ) : null}
        </StyledListItemContent>
      </StyledListItemRoot>
    );
  },
);

const ButtonWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

export interface ArenaListItemProps extends Omit<ComponentPropsWithRef<"div">, "id"> {
  title: string;
  id: number;
  isEditing?: boolean;
  user: MyNDLAUserType | undefined;
  refetchCategories: (() => void) | undefined;
  count?: number;
  visible?: boolean;
  description?: string;
}

export const ArenaListItem = forwardRef<HTMLDivElement, Assign<ListItemProps, ArenaListItemProps>>(
  ({ title, id, isEditing, visible, user, refetchCategories, count, description, ...props }, ref) => {
    const { t } = useTranslation();
    return (
      <StyledListItemRoot {...props} colorTheme="brand3" ref={ref} visible={visible}>
        <StyledListItemContent>
          <ContentWrapper>
            <ForumOutlined />
            <TextWrapper>
              <ListItemHeading asChild consumeCss>
                <StyledSafeLink to={routes.myNdla.arenaCategory(id)} unstyled css={linkOverlay.raw()}>
                  {title}
                </StyledSafeLink>
              </ListItemHeading>
              {!!description && (
                <Text textStyle="label.small" color="text.subtle">
                  {description}
                </Text>
              )}
            </TextWrapper>
          </ContentWrapper>
          <ContentWrapper>
            {isEditing && user?.isModerator && (
              <ButtonWrapper>
                <DeleteCategoryModal categoryId={id} refetchCategories={refetchCategories} />
              </ButtonWrapper>
            )}
            {count != null && (
              <NumberText textStyle="label.small" aria-label={`${count} ${t("myNdla.arena.category.posts")}`}>
                <strong>{count}</strong>
                <br />
                {t("myNdla.arena.category.posts", { count })}
              </NumberText>
            )}
          </ContentWrapper>
        </StyledListItemContent>
      </StyledListItemRoot>
    );
  },
);
