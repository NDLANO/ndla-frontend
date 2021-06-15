/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps } from 'react-router';
import LoginFailure from './LoginFailure';
import LoginSuccess from './LoginSuccess';
import LoginProviders from './LoginProviders';

interface Props extends RouteComponentProps {}

export const Login = ({ match, location, history }: Props) => {
  const authenticated = false; //fetch from auth

  if (authenticated && location.hash === '' && match.url === '/login') {
    history.push('/');
    return null;
  }

  return (
    <Fragment>
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/success`} component={LoginSuccess} />
            <Route path={`${match.url}/failure`} component={LoginFailure} />
            <Route component={LoginProviders} />
          </Switch>
        </div>
      </OneColumn>
    </Fragment>
  );
};

export default Login;
