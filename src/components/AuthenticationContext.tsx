/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FeideUserApiType } from '@ndla/ui';
import { createContext, ReactNode, useEffect, useState } from 'react';
import {
  getFeideCookie,
  isAccessTokenValid,
  millisUntilExpiration,
} from '../util/authHelpers';
import { fetchFeideUserWithGroups } from '../util/feideApi';

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  login: () => Promise<void>;
  logout: () => void;
  user: FeideUserApiType | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: false,
  login: async () => {},
  logout: () => {},
  user: undefined,
});

interface Props {
  children: ReactNode;
  initialValue?: string;
}

const AuthenticationContext = ({ children, initialValue }: Props) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue ? isAccessTokenValid(getFeideCookie(initialValue)) : false,
  );
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<FeideUserApiType | undefined>(undefined);

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);
    setLoaded(true);

    if (isValid) {
      // Since we can't listen to cookies set a timeout to update context
      const timeoutMillis = millisUntilExpiration();
      window.setTimeout(() => {
        setAuthenticated(false);
      }, timeoutMillis);
    }
  }, [authenticated]);

  const login = async () => {
    setAuthenticated(true);
    const user = await fetchFeideUserWithGroups();
    setUser(user);
  };
  const logout = () => {
    setAuthenticated(false);
    setUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, authContextLoaded, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
