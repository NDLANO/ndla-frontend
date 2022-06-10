/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../components/AuthenticationContext';

interface Props {
  element: JSX.Element;
}

const PrivateRoute = ({ element }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  return element;
};

export default PrivateRoute;
