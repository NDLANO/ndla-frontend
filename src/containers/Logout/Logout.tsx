/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import {
  Switch,
  Route,
  RouteComponentProps,
  withRouter,
} from 'react-router-dom';
import { OneColumn } from '@ndla/ui';
import LogoutProviders from './LogoutProviders';
import LogoutSession from './LogoutSession';
import { RootComponentProps } from '../../routes';

interface Props extends RouteComponentProps, RootComponentProps {}

const Logout = ({ match }: Props) => {
  return (
    <Fragment>
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/session`} component={LogoutSession} />
            <Route component={LogoutProviders} />
          </Switch>
        </div>
      </OneColumn>
    </Fragment>
  );
};

export default withRouter(Logout);
