/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import { RouteComponentProps, withRouter } from 'react-router';
import { AuthContext } from '../../components/AuthenticationContext';
import LoginSuccess from './LoginSuccess';
import LoginProviders from './LoginProviders';
import { LoginFailure } from './LoginFailure';
import { RootComponentProps } from '../../routes';

interface Props extends RouteComponentProps, RootComponentProps {}

export const Login = ({ match }: Props) => {
  const { authenticated, authContextLoaded } = useContext(AuthContext);

  return (
    <>
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/success`} component={LoginSuccess} />
            <Route path={`${match.url}/failure`} component={LoginFailure} />
            <Route
              component={(props: Props) => (
                <LoginProviders
                  authenticated={authenticated}
                  authContextLoaded={authContextLoaded}
                  history={props.history}
                />
              )}
            />
          </Switch>
        </div>
      </OneColumn>
    </>
  );
};

export default withRouter(Login);
