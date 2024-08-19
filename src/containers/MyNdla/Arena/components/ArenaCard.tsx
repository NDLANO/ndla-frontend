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
    border: "1px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
    display: "flex",
    flexDirection: "row",
    gap: "medium",
    padding: "medium",
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
    color: "icon.strong",
    mobileWide: {
      display: "none",
    },
  },
});
const StyledQuestionAnswerFill = styled(QuestionAnswerFill, {
  base: {
    color: "icon.strong",
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
          backgroundColor: "surface.disabled",
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
              <StyledHeader data-title="hover" color="text.strong">
                {title}
              </StyledHeader>
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
