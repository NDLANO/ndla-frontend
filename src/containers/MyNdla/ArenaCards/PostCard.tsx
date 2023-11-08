/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Icon from '@ndla/icons';
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '@ndla/dropdown-menu';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { HorizontalMenu } from '@ndla/icons/lib/contentType';
import { ReportOutlined } from '@ndla/icons/lib/common';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Switch } from '@ndla/switch';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';

interface Props {
  id: string;
  isMainPost: boolean;
  // avatar: {
  //   image: string;
  //   name: string;
  //   school: string;
  // };
  title: string;
  content: string;
  notify: boolean;
}

const StyledCardContainer = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: 4px;
  padding: ${spacing.normal};
`;

const StyledTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledAvatarContainer = styled.div`
  //placeholder until avatar
  display: flex;
`;

const StyledAvatarImg = styled.div`
  //placeholder until avatar
  margin-right: ${spacing.normal};
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
  border: solid 1px ${colors.brand.tertiary};
  border-radius: 50px;
`;

const StyledTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledAvatarNameSpan = styled.span`
  //placeholder until avatar
`;

const StyledSchoolNameSpan = styled.span`
  //placeholder until avatar
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledH2 = styled.h2`
  ${fonts.sizes('22px', '33px')};
  margin-top: ${spacing.normal};
`;

const StyledP = styled.p`
  ${fonts.sizes('18px', '29px')};
  margin: 0;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${spacing.normal};
`;

const StyledButton = styled(ButtonV2)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
`;

const StyledAddCommentButton = styled(ButtonV2)`
  height: 42px;
  gap: 8px;
  white-space: nowrap;
`;

const PostCard = ({ id, isMainPost, title, content, notify }: Props) => {
  return (
    <StyledCardContainer>
      <StyledTopContainer>
        <StyledAvatarContainer>
          <StyledAvatarImg>R</StyledAvatarImg>
          <StyledTextContainer>
            <StyledAvatarNameSpan>Navn Navnesen</StyledAvatarNameSpan>
            <StyledSchoolNameSpan>Skole 1</StyledSchoolNameSpan>
          </StyledTextContainer>
        </StyledAvatarContainer>
        <StyledSwitch
          onChange={function (checked: boolean): void {
            throw new Error('Function not implemented.');
          }}
          checked={false}
          label={'Få varsel om nye svar'}
          id={'1'}
        />
      </StyledTopContainer>
      <StyledContentContainer>
        <StyledH2>{title}</StyledH2>
        <StyledP>{content}</StyledP>
      </StyledContentContainer>
      <BottomContainer>
        <DropdownMenu>
          <DropdownTrigger>
            <IconButtonV2
              aria-label="Show more"
              colorTheme="light"
              title="Show more"
              variant="ghost"
            >
              <HorizontalMenu />
            </IconButtonV2>
          </DropdownTrigger>
          <DropdownContent showArrow>
            <DropdownItem>
              <StyledButton
                colorTheme="light"
                fontWeight="normal"
                shape="sharp"
                size="small"
                variant="ghost"
              >
                <ReportOutlined />
                Rapporter innlegg til moderator
              </StyledButton>
            </DropdownItem>
            <DropdownItem>
              <StyledButton
                colorTheme="light"
                fontWeight="normal"
                shape="sharp"
                size="small"
                variant="ghost"
              >
                <Pencil />
                Rediger innlegg
              </StyledButton>
            </DropdownItem>
            <DropdownItem>
              <StyledButton
                colorTheme="danger"
                fontWeight="normal"
                shape="sharp"
                size="small"
                variant="ghost"
              >
                <TrashCanOutline />
                Slett Innlegget
              </StyledButton>
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
        <StyledAddCommentButton>Skriv et svar</StyledAddCommentButton>
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
