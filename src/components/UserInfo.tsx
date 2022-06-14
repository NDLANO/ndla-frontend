/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { compact } from 'lodash';
import { useTranslation } from 'react-i18next';
import { FeideUserWithGroups } from '../util/feideApi';

const InfoList = styled.ul`
  margin: 0;
  padding: 0 0 0 ${spacing.normal};

  li {
    margin: 0;
    font-weight: ${fonts.weight.semibold};
  }
`;

interface Props {
  user: FeideUserWithGroups;
}

export const UserInfo = ({ user }: Props) => {
  const { t } = useTranslation();

  const {
    mail,
    displayName,
    eduPersonPrimaryAffiliation: affiliationRole,
    primarySchool,
  } = user;

  const collectedInfo: string[] = compact([
    primarySchool?.displayName,
    t(`user.role.${affiliationRole}`) as string,
    displayName,
    ...(mail ? mail : []),
  ]);

  return (
    <div>
      {affiliationRole && (
        <p>
          {t('user.loggedInAs', {
            role: affiliationRole,
          })}
        </p>
      )}
      {collectedInfo && collectedInfo.length > 0 && (
        <>
          {t('user.modal.collectedInfo')}
          <InfoList>
            {collectedInfo.map(value => (
              <li key={value}>{value}</li>
            ))}
          </InfoList>
        </>
      )}
    </div>
  );
};
