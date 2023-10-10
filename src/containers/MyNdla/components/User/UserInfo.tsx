/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { FeideUserApiType } from './apiTypes';
import { parseUserObject } from './parseUserObject';

const InfoList = styled.ul`
  padding: 0 0 0 ${spacing.normal};
`;

interface Props {
  user: FeideUserApiType;
}

const ShortInfoDiv = styled.div`
  margin: 2rem auto;
`;

const isTeacher = (affiliations: FeideUserApiType['eduPersonAffiliation']) => affiliations.includes('employee');

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();

  const parsedUser = parseUserObject(user);

  return (
    <div>
      {
        <p>
          {t('user.loggedInAs', {
            role: t(`user.role.${isTeacher(parsedUser.eduPersonAffiliation) ? 'employee' : 'student'}`),
          })}
        </p>
      }

      <ShortInfoDiv>
        <div data-hj-suppress>
          {t('user.username')}: <b>{user.uid}</b>
        </div>
        <div data-hj-suppress>
          {t('user.name')}: <b>{user.displayName}</b>
        </div>
        <div data-hj-suppress>
          {t('user.mail')}: <b>{user.mail?.join(', ')}</b>
        </div>
        {user.preferredLanguage && (
          <div data-hj-suppress>
            {t('user.preferredLanguage')}: <b>{t(`languages.${user.preferredLanguage}`)}</b>
          </div>
        )}
        {user.mobile && (
          <div data-hj-suppress>
            {t('user.mobile')}: <b>{user.mobile}</b>
          </div>
        )}
      </ShortInfoDiv>

      <InfoList data-hj-suppress>
        {parsedUser.organizations.map((org) => (
          <li key={org.id}>
            {`${org.displayName}${org.membership.primarySchool ? ` (${t('user.primarySchool')})` : ''}`}
            <InfoList>
              {Object.entries(org.children).map(([groupType, val]) => {
                if (val.length < 1) return null;
                return (
                  <li key={groupType}>
                    {t(`user.groupTypes.${groupType}`)}
                    <InfoList>
                      {val.map((group) => (
                        <li key={group.id}>{`${group.displayName}${group.grep ? ` (${group.grep.code})` : ''}`}</li>
                      ))}
                    </InfoList>
                  </li>
                );
              })}
            </InfoList>
          </li>
        ))}
      </InfoList>
      {parsedUser.grepCodes.length > 0 && (
        <InfoList data-hj-suppress>
          <li key="grepCodes">
            {t('user.groupTypes.grepCode')}
            <InfoList>
              {parsedUser.grepCodes.map((code) => (
                <li key={code.id}>{`${code.displayName} (${code.code})`}</li>
              ))}
            </InfoList>
          </li>
        </InfoList>
      )}
    </div>
  );
};
