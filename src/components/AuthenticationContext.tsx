import React, { useEffect, useState, createContext } from 'react';
// @ts-ignore
export const AuthContext = createContext();

interface Props {
    children: React.ReactNode
}

const AuthenticationContext = ({ children }: Props)  => {
  if (typeof localStorage === 'undefined') {
    return <>{children}</>;
  }
  
  const [authenticated, setAuthenticated] = useState(localStorage.getItem('access_token') ? true : false);

  useEffect(() => setAuthenticated(localStorage.getItem('access_token') ? true : false), []);

  const login = () => setAuthenticated(true);
  const logout = () => setAuthenticated(false);


  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;