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
import DeleteCategoryModal from "./DeleteCategoryModal";
import { MyNDLAUserType } from "../../../../components/AuthenticationContext";
import { routes } from "../../../../routeHelpers";
import DragHandle from "../../components/DragHandle";

interface Props {
  id: number;
  title: string;
  subText: string;
  count?: number;
  user: MyNDLAUserType | undefined;
  visible: boolean;
  isEditing: boolean;
  index: number;
  refetchCategories: (() => void) | undefined;
}

const StyledCardWrapper = styled("div", {
  base: {
    backgroundColor: "surface.default",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    borderWidth: "1px",
    boxShadow: "none",
    color: "text.primary",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    padding: "medium",
    paddingRight: "large",
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
    color: "text.strong",
    cursor: "pointer",
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
    color: "icon.strong",
    height: "xxlarge",
    width: "xxlarge",
    mobileWide: {
      display: "none",
    },
  },
});
const StyledQuestionAnswerFill = styled(QuestionAnswerFill, {
  base: {
    color: "icon.strong",
    height: "xxlarge",
    width: "xxlarge",
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
    zIndex: "1",
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    boxShadow: "none",
    color: "text.strong",
    flex: "1",
    textDecoration: "none",
    _after: {
      bottom: "0",
      content: "",
      left: "0",
      position: "absolute",
      right: "0",
      top: "0",
      zIndex: "1",
    },

    "& [data-normal-icon='']": {
      display: "block",
    },

    "& [data-hover-icon='']": {
      display: "none",
    },

    "& [data-visible='false']": {
      backgroundColor: "surface.disabled",
    },

    _focusWithin: {
      "& > div": {
        backgroundColor: "surface.hover",
        outline: "solid",
        "&[data-visible='false']": {
          backgroundColor: "surface.disabled",
        },
      },
      "& [data-name='hover']": {
        textDecoration: "none",
      },
      "& [data-normal-icon='']": {
        display: "none",
      },
      "& [data-hover-icon='']": {
        display: "block",
      },
    },

    _hover: {
      "& > div": {
        backgroundColor: "surface.hover",
        "&[data-visible='false']": {
          backgroundColor: "surface.disabled",
        },
      },
      "& [data-name='hover']": {
        textDecoration: "none",
      },
      "& [data-normal-icon='']": {
        display: "none",
      },
      "& [data-hover-icon='']": {
        display: "block",
      },
    },

    mobileWide: {
      _focusWithin: {
        "& [data-hover-icon='']": {
          display: "block",
        },
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
    listStyle: "none",
    padding: "0",
  },
});

const ArenaCard = ({ id, title, index, subText, count, user, visible, isEditing, refetchCategories }: Props) => {
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
      <StyledSafeLink to={routes.myNdla.arenaCategory(id)}>
        <StyledCardWrapper data-visible={visible}>
          <DragHandle
            sortableId={id.toString()}
            name={title}
            disabled={!isEditing || items.length < 2}
            type="category"
            {...attributes}
          />
          <StyledQuestionAnswerLine data-normal-icon="" />
          <StyledQuestionAnswerFill data-hover-icon="" />
          <SpacingContainer>
            <div>
              <StyledHeader data-name="hover">{title}</StyledHeader>
              <StyledDescriptionText>{subText}</StyledDescriptionText>
            </div>
            <RightSideContainer>
              {isEditing && user?.isModerator && (
                <DeleteCategoryModal categoryId={id} refetchCategories={refetchCategories} />
              )}
              {count !== undefined && (
                <StyledCountContainer aria-label={`${count} ${t("myNdla.arena.category.posts")}`}>
                  <Text aria-hidden textStyle="body.medium">
                    {count}
                  </Text>
                  <Text aria-hidden textStyle="body.small">
                    {t("myNdla.arena.category.posts", { count })}
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
