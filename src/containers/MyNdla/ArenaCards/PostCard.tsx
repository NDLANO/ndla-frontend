/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Icon from '@ndla/icons';
import { DropdownMenu, DropdownTrigger } from '@ndla/dropdown-menu';
import { Pencil } from '@ndla/icons/action';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { Switch } from '@ndla/switch';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';

interface Props {
  id: string;
  isMainPost: boolean;
  avatar: {
    image: string;
    name: string;
    school: string;
  };
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
`;

const StyledP = styled.p`
  ${fonts.sizes('18px', '29px')};
  margin: 0;
`;

const BottomContainer = styled.div`
  display: flex;
`;

const PostCard = ({}: Props) => {
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
        <StyledH2>Tittel på innlegget</StyledH2>
        <StyledP>
          Lorem ipsum dolor sit amet consectetur. Vitae ut maecenas commodo nisi
          cursus amet. Mattis a eu suspendisse massa. Vel ac risus nibh
          phasellus. Est proin in eget ligula at turpis lectus tristique.
          Ullamcorper praesent eget turpis convallis. Faucibus pellentesque
          pharetra posuere scelerisque. Ligula at neque tellus aenean. Vivamus
          posuere eu non ipsum. Ut tellus vivamus mi proin. Duis orci
          ullamcorper enim gravida nibh tristique adipiscing. Mi lobortis mauris
          sem tellus neque. Pellentesque montes ut in habitant viverra convallis
          ac.
        </StyledP>
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
                <Folder />
                Add item
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
                <DeleteForever />
                Delete item
              </StyledButton>
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
