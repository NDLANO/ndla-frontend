/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, createContext, useEffect } from 'react';
import { isAccessTokenValid, millisUntilExpiration } from '../util/authHelpers';

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: false,
  login: () => {},
  logout: () => {},
});

interface Props {
  children: React.ReactNode;
}

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);

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

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider
      value={{ authenticated, login, logout, authContextLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
