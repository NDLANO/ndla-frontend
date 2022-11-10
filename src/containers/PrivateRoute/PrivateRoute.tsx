/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactElement, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { NoSSR } from '@ndla/util';
import { AuthContext } from '../../components/AuthenticationContext';

interface Props {
  element: ReactElement;
}

const ClientPrivateRoute = ({ element }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to={'/login'} state={{ from: location.pathname }} />;
  }

  return element;
};

const PrivateRoute = (props: Props) => {
  return (
    <NoSSR fallback={null}>
      <ClientPrivateRoute {...props} />
    </NoSSR>
  );
};

export default PrivateRoute;
