/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement, useContext } from "react";
import { useHref, useLocation } from "react-router";
import { NoSSR } from "@ndla/util";
import { AuthContext } from "../../components/AuthenticationContext";
import { toHref } from "../../util/urlHelper";

interface Props {
  element: ReactElement | null;
}

const ClientPrivateRoute = ({ element }: Props) => {
  const { authenticated, authContextLoaded } = useContext(AuthContext);
  const location = useLocation();
  const loginHref = useHref(`/login?returnTo=${toHref(location)}`);

  if (!authenticated && authContextLoaded) {
    window.location.href = loginHref;
    return null;
  }

  return element;
};

export const PrivateRoute = (props: Props) => {
  return (
    <NoSSR fallback={null}>
      <ClientPrivateRoute {...props} />
    </NoSSR>
  );
};
