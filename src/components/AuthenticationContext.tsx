/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, createContext, useEffect } from 'react';
import { isAccessTokenValid } from '../util/authHelpers';

export const AuthContext = createContext({
  authenticated: false,
  authContextLoaded: false,
  login: () => console.log(''),
  logout: () => console.log(''),
});

interface Props {
  children: React.ReactNode;
}

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);

  useEffect(() => {
    setAuthenticated(isAccessTokenValid());
    setLoaded(true);
  }, []);

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
