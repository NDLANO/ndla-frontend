/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  GQLMyNdlaDataQuery,
  GQLMyNdlaPersonalDataFragmentFragment,
} from '../graphqlTypes';
import { isAccessTokenValid, millisUntilExpiration } from '../util/authHelpers';
import { useGraphQuery } from '../util/runQueries';

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  login: () => void;
  logout: () => void;
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
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

const personalDataQueryFragment = gql`
  fragment MyNdlaPersonalDataFragment on MyNdlaPersonalData {
    username
    displayName
    groups {
      id
      displayName
      isPrimarySchool
      parentId
    }
    organization
    favoriteSubjects
    role
    arenaEnabled
    shareName
  }
`;

const myNdlaQuery = gql`
  query myNdlaData {
    examLockStatus {
      key
      value
    }
    personalData {
      ...MyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<
    GQLMyNdlaPersonalDataFragmentFragment | undefined
  >(undefined);
  const [examLock, setExamLock] = useState(false);

  const myNdlaData = useGraphQuery<GQLMyNdlaDataQuery>(myNdlaQuery, {
    skip: typeof window === 'undefined',
  });

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);

    if (!myNdlaData.data) return;

    const { personalData, examLockStatus } = myNdlaData.data;

    if (isValid && personalData !== undefined) {
      if (personalData?.role === 'student') {
        setExamLock(examLockStatus?.value === true);
      }
      setUser(personalData);
      setLoaded(true);
      // Since we can't listen to cookies set a timeout to update context
      const timeoutMillis = millisUntilExpiration();
      window.setTimeout(() => {
        setAuthenticated(false);
      }, timeoutMillis);
    } else {
      setLoaded(true);
    }
  }, [myNdlaData.data]);

  const login = useCallback(() => setAuthenticated(true), []);
  const logout = useCallback(() => setAuthenticated(false), []);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        authContextLoaded,
        login,
        logout,
        user,
        examLock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
