/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { FeideText, LogIn } from '@ndla/icons/common';

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

const FeideFooter = () => {
  const { t } = useTranslation();
  const { authenticated, user } = useContext(AuthContext);
  const affiliationRole = user?.eduPersonPrimaryAffiliation;

  return (
    <StyledFeideFooter>
      <h2>
        <FeideText />
      </h2>

      <div>
        <p>{t('user.generalFooter')}</p>
        <FeideLoginButton footer>
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
