/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import styled from '@emotion/styled';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { colors, spacing, fonts, misc } from '@ndla/core';
import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from '@ndla/dropdown-menu';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { HorizontalMenu } from '@ndla/icons/contentType';
import { ReportOutlined } from '@ndla/icons/common';
import { Switch } from '@ndla/switch';
import { Text } from '@ndla/typography';
import { useTranslation } from 'react-i18next';
import UserProfileTag from '../components/UserProfileTag';

interface Props {
  id: string;
  isMainPost: boolean;
  title: string;
  content: string;
  notify: boolean;
  displayName: string;
  username: string;
  affiliation: string;
}

const StyledCardContainer = styled.div`
  background-color: ${colors.background.lightBlue};
  border: ${colors.brand.light} solid 1px;
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
`;

const StyledTopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledH2 = styled.div`
  ${fonts.sizes('22px', '33px')};
  margin-top: ${spacing.normal};
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
  white-space: nowrap;
`;

const PostCard = ({
  id,
  title,
  content,
  isMainPost,
  displayName,
  username,
  affiliation,
}: Props) => {
  const { t } = useTranslation();

  return (
    <StyledCardContainer key={id}>
      <StyledTopContainer>
        <UserProfileTag
          displayName={displayName}
          username={username}
          affiliation={affiliation}
        />
        <StyledSwitch
          onChange={() => {}}
          checked={false}
          label={t('myNdla.arena.posts.notify')}
          id={'1'}
        />
      </StyledTopContainer>
      <StyledContentContainer>
        {isMainPost && <StyledH2>{title}</StyledH2>}
        <Text element="p" textStyle="content-alt" margin="none">
          {parse(content)}
        </Text>
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
                {t('myNdla.arena.posts.dropdownMenu.report')}
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
                {t('myNdla.arena.posts.dropdownMenu.edit')}
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
                {t('myNdla.arena.posts.dropdownMenu.delete')}
              </StyledButton>
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
        <StyledAddCommentButton>
          {t('myNdla.arena.posts.comment')}
        </StyledAddCommentButton>
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
