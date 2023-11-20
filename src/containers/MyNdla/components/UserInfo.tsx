/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { Text } from '@ndla/typography';
import { UnOrderedList } from '@ndla/ui';
import { FeideUserApiType } from '../../../interfaces';
import { parseUserObject } from './parseUserObject';
import { isStudent } from '../Folders/util';

interface Props {
  user: FeideUserApiType;
}

const StyledComponentContainer = styled.div`
  max-width: 700px;
`;

const ShortInfoDiv = styled.div`
  margin: ${spacing.normal} auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
`;

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();
  const parsedUser = parseUserObject(user);

  return (
    <StyledComponentContainer>
      {
        <Text element="p" textStyle="content-alt" margin="none">
          {t('user.loggedInAs', {
            role: t(`user.role.${isStudent(user) ? 'student' : 'employee'}`),
          })}
        </Text>
      }
      <ShortInfoDiv>
        <Text element="p" textStyle="content-alt" margin="none">
          {t('user.username')}: {user.uid}
        </Text>
        <Text element="p" textStyle="content-alt" margin="none">
          {t('user.name')}: {user.displayName}
        </Text>
        <Text element="p" textStyle="content-alt" margin="none">
          {t('user.mail')}: {user.mail?.join(', ')}
        </Text>
        {user.preferredLanguage && (
          <Text element="p" textStyle="content-alt" margin="none">
            {t('user.preferredLanguage')}:{' '}
            {t(`languages.${user.preferredLanguage}`)}
          </Text>
        )}
        {user.mobile && (
          <Text element="p" textStyle="content-alt" margin="none">
            {t('user.mobile')}: {user.mobile}
          </Text>
        )}
      </ShortInfoDiv>
      <UnOrderedList>
        {parsedUser.organizations.map((org) => (
          <Text element="li" textStyle="content-alt" margin="none" key={org.id}>
            {`${org.displayName}${
              org.membership.primarySchool
                ? ` (${t('user.primarySchool')})`
                : ''
            }`}
            <UnOrderedList>
              {Object.entries(org.children).map(([groupType, val]) => {
                if (val.length < 1) return null;
                return (
                  <Text
                    element="li"
                    textStyle="content-alt"
                    margin="none"
                    key={groupType}
                  >
                    {t(`user.groupTypes.${groupType}`)}
                    <UnOrderedList>
                      {val.map((group) => (
                        <Text
                          element="li"
                          textStyle="content-alt"
                          margin="none"
                          key={group.id}
                        >{`${group.displayName}${
                          group.grep ? ` (${group.grep.code})` : ''
                        }`}</Text>
                      ))}
                    </UnOrderedList>
                  </Text>
                );
              })}
            </UnOrderedList>
          </Text>
        ))}
      </UnOrderedList>
      {parsedUser.grepCodes.length > 0 && (
        <UnOrderedList>
          <Text
            element="li"
            textStyle="content-alt"
            margin="none"
            key="grepCodes"
          >
            {t('user.groupTypes.grepCode')}
            <UnOrderedList>
              {parsedUser.grepCodes.map((code) => (
                <Text
                  element="li"
                  textStyle="content-alt"
                  margin="none"
                  key={code.id}
                >{`${code.displayName} (${code.code})`}</Text>
              ))}
            </UnOrderedList>
          </Text>
        </UnOrderedList>
      )}
    </StyledComponentContainer>
  );
};
