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
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing, breakpoints, mq, misc } from "@ndla/core";
import { Forum, ForumOutlined } from "@ndla/icons/common";
import SafeLink from "@ndla/safelink";
import { Text } from "@ndla/typography";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { MyNDLAUserType } from "../../../../components/AuthenticationContext";
import { toMyNdlaArenaCategory } from "../../../../routeHelpers";
import DragHandle from "../../Folders/DragHandle";

interface Props {
  id: number;
  title: string;
  subText: string;
  count?: number;
  user: MyNDLAUserType;
  visible: boolean;
  isEditing: boolean;
  index: number;
}

const StyledCardWrapper = styled.div`
  color: ${colors.text.primary};
  display: flex;
  flex-direction: row;
  gap: ${spacing.normal};
  padding: ${spacing.normal};
  padding-right: ${spacing.medium};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  box-shadow: none;

  position: relative;

  [data-hover-icon=""] {
    display: none;
  }

  &[data-visible="false"] {
    background-color: ${colors.brand.greyLight};
  }

  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    [data-name="hover"] {
      text-decoration: none;
    }

    [data-normal-icon=""] {
      display: none;
    }
  }

  ${mq.range({ from: breakpoints.mobileWide })} {
    &:hover,
    &:focus-within {
      [data-hover-icon=""] {
        display: block;
      }
    }
  }
`;

const SpacingContainer = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
  width: 100%;
`;

const StyledHeader = styled(Text)`
  color: ${colors.brand.primary};
  text-decoration: underline;
  cursor: pointer;
`;

const StyledDescriptionText = styled(Text)`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledCountContainer = styled.div`
  text-align: center;
`;

const iconCss = css`
  width: ${spacing.large};
  height: ${spacing.large};
  color: ${colors.brand.primary};
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const RightSideContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.normal};
  align-items: center;
  z-index: 1;
`;

const StyledSafeLink = styled(SafeLink)`
  text-decoration: none;
  box-shadow: none;
  color: ${colors.brand.primary};
  flex: 1;

  // To make the link clickable in the entire container, not only text
  :after {
    content: "";
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const ArenaCardWrapper = styled.li`
  list-style: none;
  padding: 0;
`;

const ArenaCard = ({ id, title, index, subText, count, user, visible, isEditing }: Props) => {
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
      <StyledCardWrapper data-visible={visible}>
        <DragHandle
          sortableId={id.toString()}
          name={title}
          disabled={!isEditing || items.length < 2}
          type="category"
          {...attributes}
        />
        <ForumOutlined data-normal-icon="" css={iconCss} />
        <Forum data-hover-icon="" css={iconCss} />
        <SpacingContainer>
          <div>
            <StyledSafeLink to={toMyNdlaArenaCategory(id)}>
              <StyledHeader element="p" textStyle="label-small" margin="none" data-name="hover">
                {title}
              </StyledHeader>
            </StyledSafeLink>
            <StyledDescriptionText element="p" textStyle="meta-text-small" margin="none">
              {subText}
            </StyledDescriptionText>
          </div>
          <RightSideContainer>
            {isEditing && user.isModerator && <DeleteCategoryModal categoryId={id} />}
            {count !== undefined && (
              <StyledCountContainer>
                <Text element="p" textStyle="content-alt" margin="none">
                  {count}
                </Text>
                <Text textStyle="meta-text-small" margin="none">
                  {t("myNdla.arena.category.posts", { count })}
                </Text>
              </StyledCountContainer>
            )}
          </RightSideContainer>
        </SpacingContainer>
      </StyledCardWrapper>
    </ArenaCardWrapper>
  );
};

export default ArenaCard;
