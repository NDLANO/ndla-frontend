/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {  Fragment, useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps } from 'react-router';
import LoginFailure from './LoginFailure';
import LoginSuccess from './LoginSuccess';
import LoginProviders from './LoginProviders';
import {AuthContext} from '../../components/AuthenticationContext';

interface Props extends RouteComponentProps {}

export const Login = ({ match, location, history }: Props) => {
  let authenticated: boolean | undefined = undefined;
  if(typeof localStorage !== 'undefined'){
  // @ts-ignore
   authenticated  = useContext(AuthContext).authenticated; 
  }

  if(authenticated === undefined){
    return<></>;
  }

  if (authenticated && location.hash === '' && match.url === '/login') {
    console.log(authenticated);
    history.push('/');
    return <div/>;
  }

  return (
    <Fragment>
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/success`} component={LoginSuccess} />
            <Route path={`${match.url}/failure`} component={LoginFailure} />
            <Route component={ () => <LoginProviders authenticated={authenticated}/> }  />
          </Switch>
        </div>
      </OneColumn>
    </Fragment>
  );
};

export default Login;
