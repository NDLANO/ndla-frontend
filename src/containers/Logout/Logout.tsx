/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Switch, Route, RouteComponentProps } from 'react-router-dom';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import LogoutProviders from './LogoutProviders';
import LogoutSession from './LogoutSession';

interface Props {
  match: RouteComponentProps['match'];
}

const Logout = ({ match }: Props) => {
  return (
    <>
      <OneColumn cssModifier="clear">
        <div className="u-2/3@desktop u-push-1/3@desktop">
          <Switch>
            <Route path={`${match.url}/session`} component={LogoutSession} />
            <Route component={LogoutProviders} />
          </Switch>
        </div>
      </OneColumn>
    </>
  );
};

export default Logout;
