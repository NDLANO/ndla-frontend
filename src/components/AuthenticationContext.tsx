import React, { useState, createContext, useEffect } from 'react';
import { isAccessTokenValid } from '../util/authHelpers';

export const AuthContext = createContext({
  authenticated: false,
  login : () => console.log(),
  logout : () => console.log(),
  authContextLoaded: false
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
