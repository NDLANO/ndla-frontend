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
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
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
import { Text, Heading } from '@ndla/typography';
import { useTranslation } from 'react-i18next';
import UserProfileTag from '../components/UserProfileTag';

interface Props {
  id: string;
  timestamp: string;
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
  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column-reverse;
  }
`;

const StyledSwitch = styled(Switch)`
  align-self: flex-start;
  padding: ${spacing.xsmall};
  ${mq.range({ until: breakpoints.desktop })} {
    align-self: flex-end;
    margin-bottom: ${spacing.small};
  }
`;

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin: ${spacing.normal} 0;
`;

const StyledText = styled(Text)`
  p {
    margin: 0;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledTimestamp = styled(Text)`
  //Trenger funksjon for utregning av tid
  align-self: center;
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
  timestamp,
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
        {isMainPost && (
          <StyledSwitch
            onChange={() => {}}
            checked={false}
            label={t('myNdla.arena.posts.notify')}
            id={t('myNdla.arena.posts.notify')}
          />
        )}
      </StyledTopContainer>
      <StyledContentContainer>
        {isMainPost && (
          <Heading element="h4" headingStyle="h4" margin="none">
            {title}
          </Heading>
        )}
        <StyledText element="p" textStyle="content-alt" margin="none">
          {parse(content)}
        </StyledText>
      </StyledContentContainer>
      <BottomContainer>
        {!isMainPost && (
          <StyledTimestamp element="p" textStyle="content-alt" margin="none">
            {timestamp}
          </StyledTimestamp>
        )}
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
        {isMainPost && (
          <StyledAddCommentButton>
            {t('myNdla.arena.posts.comment')}
          </StyledAddCommentButton>
        )}
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
