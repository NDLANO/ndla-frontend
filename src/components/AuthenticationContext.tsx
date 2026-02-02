/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createContext, ReactNode, useMemo, useSyncExternalStore } from "react";
import { GQLMyNdlaDataQuery, GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";
import { getActiveSessionCookieClient, isActiveSession, millisUntilExpiration } from "../util/authHelpers";

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined;
  examLock: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  authContextLoaded: true,
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
  const ms = millisUntilExpiration(getActiveSessionCookieClient());
  const timeout = setTimeout(callback, ms);
  return () => clearTimeout(timeout);
};

const getSnapshot = () => {
  return isActiveSession(getActiveSessionCookieClient());
};

export const AuthenticationContext = ({ children }: Props) => {
  const authenticated = useSyncExternalStore(timeoutSubscribe, getSnapshot, () => undefined);

  const myNdlaData = useQuery<GQLMyNdlaDataQuery>(myNdlaQuery, {
    skip: typeof window === "undefined" || !authenticated,
  });

  const authContextLoaded = useMemo(() => {
    return authenticated !== undefined && myNdlaData.loading === false;
  }, [authenticated, myNdlaData.loading]);

  const user = useMemo(() => {
    if (authenticated) return myNdlaData.data?.personalData;
    return undefined;
  }, [authenticated, myNdlaData.data?.personalData]);

  const examLock = useMemo(() => {
    return (
      !!authenticated &&
      myNdlaData.data?.personalData?.role === "student" &&
      myNdlaData.data?.examLockStatus?.value === true
    );
  }, [authenticated, myNdlaData.data]);

  return (
    <AuthContext
      value={{
        authenticated: !!authenticated,
        authContextLoaded,
        user,
        examLock,
      }}
    >
      {children}
    </AuthContext>
  );
};
