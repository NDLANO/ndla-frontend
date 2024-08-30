/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionAnswerFill, QuestionAnswerLine } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { MyNDLAUserType } from "../../../../components/AuthenticationContext";
import { routes } from "../../../../routeHelpers";
import DragHandle from "../../components/DragHandle";

interface Props {
  id: number;
  title: string;
  subText: string;
  topicCount?: number;
  voteCount?: number;
  user: MyNDLAUserType | undefined;
  visible: boolean;
  isEditing: boolean;
  index: number;
  refetchCategories: (() => void) | undefined;
}

const StyledCardWrapper = styled("div", {
  base: {
    alignItems: "center",
    backgroundColor: "surface.default",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    padding: "small",
    paddingInlineEnd: "large",
    position: "relative",
  },
});

const SpacingContainer = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    justifyContent: "space-between",
    width: "100%",
  },
});

const StyledHeader = styled(Text, {
  base: {
    textDecoration: "underline",
  },
});

const StyledDescriptionText = styled(Text, {
  base: {
    display: "none",
    mobileWide: {
      display: "block",
    },
  },
});

const StyledCountContainer = styled("div", {
  base: {
    textAlign: "center",
  },
});

const StyledQuestionAnswerLine = styled(QuestionAnswerLine, {
  base: {
    mobileWide: {
      display: "none",
    },
  },
});
const StyledQuestionAnswerFill = styled(QuestionAnswerFill, {
  base: {
    mobileWide: {
      display: "none",
    },
  },
});

const RightSideContainer = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    boxShadow: "none",
    flex: "1",
    textDecoration: "none",

    "& [data-normal-icon]": {
      display: "none",
    },
    "& [data-hover-icon]": {
      display: "none",
    },
    "& [data-visible='false']": {
      backgroundColor: "surface.disabled",
    },

    _hover: {
      "& > div": {
        backgroundColor: "surface.hover",
        "&[data-visible='false']": {
          backgroundColor: "surface.disabled", //TODO: Avsjekke om det fortsatt skal være egen bakgrunnsfarge på ikke-synlige topics
        },
      },
      "& [data-title='hover']": {
        textDecoration: "none",
      },
      "& [data-normal-icon='']": {
        display: "none",
      },
      "& [data-hover-icon='']": {
        display: "none",
      },
    },

    mobileWide: {
      "& [data-normal-icon='']": {
        display: "block",
      },
      "& [data-hover-icon='']": {
        display: "none",
      },
      _hover: {
        "& [data-hover-icon='']": {
          display: "block",
        },
      },
    },
  },
});

const ArenaCardWrapper = styled("li", {
  base: {
    alignItems: "center",
    display: "block",
    justifyContent: "center",
    listStyle: "none",
    padding: "0",
    position: "relative",
    mobileWide: {
      display: "flex",
    },
  },
});

const ArenaCard = ({
  id,
  title,
  index,
  subText,
  topicCount,
  voteCount,
  user,
  visible,
  isEditing,
  refetchCategories,
}: Props) => {
  const { t } = useTranslation();

  const { attributes, setNodeRef, transform, transition, items, isDragging } = useSortable({
    id: id.toString(),
    data: {
      name: title,
      index: index + 1,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ArenaCardWrapper id={`category-${id}`} ref={setNodeRef} data-is-dragging={isDragging} style={style}>
      <DragHandle
        sortableId={id.toString()}
        name={title}
        disabled={!isEditing || items.length < 2}
        type="category"
        {...attributes}
      />
      <StyledSafeLink to={routes.myNdla.arenaCategory(id)} css={linkOverlay.raw()}>
        <StyledCardWrapper data-visible={visible}>
          <StyledQuestionAnswerLine data-normal-icon="" />
          <StyledQuestionAnswerFill data-hover-icon="" />
          <SpacingContainer>
            <div>
              <StyledHeader data-title="hover">{title}</StyledHeader>
              <StyledDescriptionText textStyle="body.small">{subText}</StyledDescriptionText>
            </div>
            <RightSideContainer>
              {isEditing && user?.isModerator && (
                <DeleteCategoryModal categoryId={id} refetchCategories={refetchCategories} />
              )}
              {topicCount !== undefined && (
                <StyledCountContainer aria-label={`${topicCount} ${t("myNdla.arena.category.posts")}`}>
                  <Text aria-hidden textStyle="body.medium">
                    {topicCount}
                  </Text>
                  <Text aria-hidden textStyle="label.small">
                    {t("myNdla.arena.category.posts", { count: topicCount })}
                  </Text>
                </StyledCountContainer>
              )}
              {voteCount !== undefined && (
                <StyledCountContainer
                  aria-label={`${voteCount} ${t(`myNdla.arena.category.vote${voteCount === 1 ? "Singular" : "Plural"}`)}`}
                >
                  <Text aria-hidden textStyle="body.medium">
                    {voteCount}
                  </Text>
                  <Text aria-hidden textStyle="label.small">
                    {t(`myNdla.arena.category.vote${voteCount === 1 ? "Singular" : "Plural"}`, { count: voteCount })}
                  </Text>
                </StyledCountContainer>
              )}
            </RightSideContainer>
          </SpacingContainer>
        </StyledCardWrapper>
      </StyledSafeLink>
    </ArenaCardWrapper>
  );
};

export default ArenaCard;
