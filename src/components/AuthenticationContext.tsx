/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useMemo, useSyncExternalStore } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { GQLMyNdlaDataQuery, GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";
import { isAccessTokenValid, millisUntilExpiration } from "../util/authHelpers";

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
  examLock: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: false,
  user: undefined,
  examLock: false,
});

interface Props {
  children: ReactNode;
  initialValue?: string;
}

export const personalDataQueryFragment = gql`
  fragment MyNdlaPersonalDataFragment on MyNdlaPersonalData {
    __typename
    id
    username
    email
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

const timeoutSubscribe = (callback: VoidFunction) => {
  const ms = millisUntilExpiration();
  const timeout = setTimeout(callback, ms);
  return () => clearTimeout(timeout);
};

export const AuthenticationContext = ({ children }: Props) => {
  const authenticated = useSyncExternalStore(timeoutSubscribe, isAccessTokenValid, () => false);

  const myNdlaData = useQuery<GQLMyNdlaDataQuery>(myNdlaQuery, {
    skip: typeof window === "undefined" || !authenticated,
  });

  const authContextLoaded = useMemo(() => {
    return myNdlaData.loading === false;
  }, [myNdlaData.loading]);

  const user = useMemo(() => {
    if (authenticated) return myNdlaData.data?.personalData;
    return undefined;
  }, [authenticated, myNdlaData.data?.personalData]);

  const examLock = useMemo(() => {
    return (
      authenticated &&
      myNdlaData.data?.personalData?.role === "student" &&
      myNdlaData.data?.examLockStatus?.value === true
    );
  }, [authenticated, myNdlaData.data]);

  return (
    <AuthContext
      value={{
        authenticated,
        authContextLoaded,
        user,
        examLock,
      }}
    >
      {children}
    </AuthContext>
  );
};
