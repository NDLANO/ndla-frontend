/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { RouteProps, useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { compact } from 'lodash';

import { AuthModal } from '@ndla/ui';
import styled from '@emotion/styled';
import { StyledButton } from '@ndla/button';
import {
  fetchFeideGroups,
  fetchFeideUser,
  FeideGroupType,
  FeideUser,
} from '../../util/feideApi';

import { AuthContext } from '../AuthenticationContext';

const FeideButton = styled(StyledButton)`
  background: transparent;
  transition: background-color 200ms ease-in-out 0s;
  color: rgb(32, 88, 143);
  border: none;
  border-radius: 26px;
  font-weight: 400;
  padding: 13px 19.5px;
  font-size: 0.888889rem;
  line-height: 18px;

  &:hover {
    box-shadow: none;
    color: rgb(32, 88, 143);
    background-color: rgb(206, 221, 234);
    border: none;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

const FeideFooterButton = styled(StyledButton)`
  padding: 4px 16px;
  background: transparent;
  color: rgb(255, 255, 255);
  border: 2px solid rgb(117, 117, 117);
  line-height: 18px;
  min-height: 48px;
`;

interface Props {
  footer?: boolean;
  children?: ReactElement;
  location: RouteProps['location'];
}

const FeideLoginButton = ({ footer, children, location }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { authenticated } = useContext(AuthContext);
  const [feideGroups, setFeideGroups] = useState<FeideGroupType[]>();
  const [feideUser, setFeideUser] = useState<FeideUser>();
  const primarySchool =
    feideGroups?.length === 1
      ? feideGroups[0]
      : feideGroups?.find(g => g.membership.primarySchool);
  const affiliationRole = feideUser?.eduPersonPrimaryAffiliation;

  useEffect(() => {
    let mounted = true;
    if (authenticated) {
      fetchFeideGroups().then((a: FeideGroupType[] | undefined) => {
        if (mounted) setFeideGroups(a);
      });
      fetchFeideUser().then((u: FeideUser | undefined) => {
        if (mounted) setFeideUser(u);
      });
    }
    return () => {
      mounted = false;
    };
  }, [authenticated]);

  const collectedInfo: string[] = compact([
    primarySchool?.displayName,
    affiliationRole ? t('user.role.' + affiliationRole) : undefined,
    feideUser?.displayName,
    ...(feideUser?.mail ? feideUser.mail : []),
  ]);

  return (
    <AuthModal
      activateButton={
        footer ? (
          <FeideFooterButton>{children}</FeideFooterButton>
        ) : (
          <FeideButton>{children}</FeideButton>
        )
      }
      isAuthenticated={authenticated}
      authorizedCollectedInfo={collectedInfo}
      authorizedRole={affiliationRole && t('user.role.' + affiliationRole)}
      onAuthenticateClick={() => {
        location && localStorage.setItem('lastPath', location.pathname);
        if (authenticated) {
          history.push('/logout');
        } else {
          history.push('/login');
        }
      }}
    />
  );
};

FeideLoginButton.defaultProps = {
  footer: false,
};

export default FeideLoginButton;
