/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useContext, useEffect } from 'react';
import { RouteProps } from 'react-router';

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { FeideText, LogIn } from '@ndla/icons/common';

import {
  fetchFeideGroups,
  FeideGroupType,
} from '../../../components/FeideLoginButton/feideApi';
import FeideLoginButton from '../../../components/FeideLoginButton';
import { AuthContext } from '../../../components/AuthenticationContext';

const StyledFeideFooter = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  background: rgb(34, 34, 34);
  color: rgb(255, 255, 255);
  padding: 32.5px 26px 52px;
  h2 {
    margin: 0;
    svg {
      width: 82px;
      height: 28px;
    }
  }
  div {
    display: flex;
    flex-direction: column;
    margin-top: 26px;
    -webkit-box-align: center;
    align-items: center;

    p {
      margin: 0px 0px 32.5px;
      font-weight: 300;
      line-height: 32px;

      span {
        margin-left: 6.5px;
      }
    }
  }
`;

interface Props {
  location: RouteProps['location'];
}

const FeideFooter = ({ location }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const [feideGroups, setFeideGroups] = useState<FeideGroupType[]>();
  const primarySchool = feideGroups?.find(g => g.membership.primarySchool);
  const parentOrg = feideGroups?.find(g => g.id === primarySchool?.parent);
  const affiliationRole = parentOrg?.membership.primaryAffiliation;

  useEffect(() => {
    if (authenticated) {
      fetchFeideGroups().then((a: FeideGroupType[] | undefined) => {
        setFeideGroups(a);
      });
    }
  }, [authenticated]);
  return (
    <StyledFeideFooter>
      <h2>
        <FeideText />
      </h2>

      <div>
        <p>{t('user.generalFooter')}</p>
        <FeideLoginButton footer location={location}>
          {authenticated ? (
            <span>
              {' '}
              {t('user.loggedInAsButton', {
                role: t('user.role.' + affiliationRole),
              })}
            </span>
          ) : (
            <span>
              {t('user.buttonLogIn')} <LogIn className="c-icon--medium" />
            </span>
          )}
        </FeideLoginButton>
      </div>
    </StyledFeideFooter>
  );
};

export default FeideFooter;
