/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, createContext, useEffect } from 'react';
import {
  FeideGroupType,
  FeideUser,
  fetchFeideUserWithGroups,
} from '../util/feideApi';
import { isAccessTokenValid, millisUntilExpiration } from '../util/authHelpers';

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  groups: FeideGroupType[] | undefined;
  login: () => void;
  logout: () => void;
  user: FeideUser | undefined;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: false,
  groups: undefined,
  login: () => {},
  logout: () => {},
  user: undefined,
});

interface Props {
  children: React.ReactNode;
}

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<FeideUser | undefined>(undefined);
  const [groups, setGroups] = useState<FeideGroupType[] | undefined>(undefined);

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);
    setLoaded(true);

    if (isValid) {
      fetchFeideUserWithGroups().then(user => {
        setUser(user);
        setGroups(user?.groups);
      });
      // Since we can't listen to cookies set a timeout to update context
      const timeoutMillis = millisUntilExpiration();
      window.setTimeout(() => {
        setAuthenticated(false);
      }, timeoutMillis);
    }
  }, [authenticated]);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider
      value={{ authenticated, authContextLoaded, groups, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
