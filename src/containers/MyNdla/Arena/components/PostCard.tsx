/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing, misc, mq, breakpoints } from '@ndla/core';
import { Pencil, TrashCanOutline } from '@ndla/icons/action';
import { ReportOutlined } from '@ndla/icons/common';
import { Switch } from '@ndla/switch';
import { Text, Heading } from '@ndla/typography';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { nb, nn, enGB } from 'date-fns/locale';
import { formatDistanceStrict } from 'date-fns';
import UserProfileTag from '../../components/UserProfileTag';
import SettingsMenu from '../../components/SettingsMenu';
import FlagContentModalContent from './FlagContentModalContent';

interface Props {
  id: number;
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

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledTimestamp = styled(Text)`
  align-self: center;
`;

const Locales = {
  nn: nn,
  nb: nb,
  en: enGB,
  se: nb,
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

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
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const now = useMemo(() => new Date(), []);

  const menu = useMemo(
    () => (
      <SettingsMenu
        menuItems={[
          {
            icon: <Pencil />,
            text: t('myNdla.arena.posts.dropdownMenu.edit'),
            type: 'primary',
          },
          {
            icon: <ReportOutlined />,
            text: t('myNdla.arena.posts.dropdownMenu.report'),
            type: 'primary',
            isModal: true,
            modality: false,
            modalContent: (close) => (
              <FlagContentModalContent id={id} onClose={close} />
            ),
          },
          {
            icon: <TrashCanOutline />,
            type: 'danger',
            text: t('myNdla.arena.posts.dropdownMenu.delete'),
          },
        ]}
      />
    ),
    [id, t],
  );

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
        <Text element="p" textStyle="content-alt" margin="none">
          {parse(content ?? '')}
        </Text>
      </StyledContentContainer>
      <BottomContainer>
        {!isMainPost && (
          <StyledTimestamp element="p" textStyle="content-alt" margin="none">
            {`${capitalizeFirstLetter(
              formatDistanceStrict(Date.parse(timestamp), now, {
                addSuffix: true,
                locale: Locales[language],
                roundingMethod: 'floor',
              }),
            )}`}
          </StyledTimestamp>
        )}
        {menu}
        {isMainPost && <ButtonV2>{t('myNdla.arena.new.post')}</ButtonV2>}
      </BottomContainer>
    </StyledCardContainer>
  );
};

export default PostCard;
