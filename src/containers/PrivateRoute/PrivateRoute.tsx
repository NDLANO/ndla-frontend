/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactElement, useContext } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NoSSR } from '@ndla/util';
import { AuthContext } from '../../components/AuthenticationContext';
import { constructNewPath, toHref } from '../../util/urlHelper';

interface Props {
  element: ReactElement;
}

const ClientPrivateRoute = ({ element }: Props) => {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();
  const { lang } = useParams();

  if (!authenticated) {
    window.location.href = constructNewPath(
      `/login?state=${toHref(location)}`,
      lang,
    );
    return null;
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
