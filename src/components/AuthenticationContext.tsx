/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { FeideUserApiType } from '@ndla/ui';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { isAccessTokenValid, millisUntilExpiration } from '../util/authHelpers';
import { fetchFeideUserWithGroups } from '../util/feideApi';
import { fetchExamLockStatus } from '../util/learningPathApi';

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  login: () => void;
  logout: () => void;
  user: FeideUserApiType | undefined;
  examLock: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: false,
  login: () => {},
  logout: () => {},
  user: undefined,
  examLock: false,
});

interface Props {
  children: ReactNode;
  initialValue?: string;
}

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<FeideUserApiType | undefined>(undefined);
  const [examLock, setExamLock] = useState(false);

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);
    setLoaded(true);

    if (isValid) {
      fetchFeideUserWithGroups().then(user => {
        if (user?.eduPersonPrimaryAffiliation === 'student') {
          fetchExamLockStatus()
            .then(res => {
              if (res.value === 'true') {
                setExamLock(true);
              }
            })
            .catch(e => {
              console.error('Could not fetch exam lock status:', e);
            });
        }
        setUser(user);
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
      value={{
        authenticated,
        authContextLoaded,
        login,
        logout,
        user,
        examLock,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
