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
  GQLExamLockStatusQuery,
  GQLMyNdlaPersonalDataFragmentFragment,
  GQLMyNdlaUserQuery,
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

const examLockStatusQuery = gql`
  query examLockStatus {
    examLockStatus {
      key
      value
    }
  }
`;

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

const myProfileQuery = gql`
  query MyNdlaUser {
    myNdlaUser {
      ...MyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

const useMyNdlaUser = () => {
  const { data, loading, error } =
    useGraphQuery<GQLMyNdlaUserQuery>(myProfileQuery);
  const myNdlaUser = data?.myNdlaUser;
  return { myNdlaUser, loading, error };
};

const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<
    GQLMyNdlaPersonalDataFragmentFragment | undefined
  >(undefined);
  const [examLock, setExamLock] = useState(false);

  const { data: { examLockStatus } = {}, error: examLockError } =
    useGraphQuery<GQLExamLockStatusQuery>(examLockStatusQuery);

  const { myNdlaUser, loading, error } = useMyNdlaUser();

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);

    if (isValid && myNdlaUser !== undefined) {
      if (myNdlaUser?.role === 'student') {
        setExamLock(examLockStatus?.value === true);
      }
      setUser(myNdlaUser);
      setLoaded(true);
      // Since we can't listen to cookies set a timeout to update context
      const timeoutMillis = millisUntilExpiration();
      window.setTimeout(() => {
        setAuthenticated(false);
      }, timeoutMillis);
    } else {
      setLoaded(true);
    }
  }, [
    authenticated,
    myNdlaUser,
    loading,
    error,
    examLockError,
    examLockStatus?.value,
  ]);

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
