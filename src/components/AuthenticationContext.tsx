/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import config from "../config";
import { GQLMyNdlaDataQuery, GQLMyNdlaPersonalDataFragmentFragment } from "../graphqlTypes";
import { isAccessTokenValid, millisUntilExpiration } from "../util/authHelpers";

export type MyNDLAUserType = GQLMyNdlaPersonalDataFragmentFragment & {
  isModerator: boolean;
};

interface AuthContextType {
  authenticated: boolean;
  authContextLoaded: boolean;
  user: MyNDLAUserType | undefined;
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

export const isArenaModerator = (groups?: string[]): boolean => {
  if (!groups) return false;
  return groups.includes(config.arenaAdminGroup) || groups.includes(config.arenaModeratorGroup);
};

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
    arenaAccepted
    arenaGroups
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
  const [user, setUser] = useState<MyNDLAUserType | undefined>(undefined);
  const [examLock, setExamLock] = useState(false);

  const myNdlaData = useQuery<GQLMyNdlaDataQuery>(myNdlaQuery, {
    skip: typeof window === "undefined" || !isAccessTokenValid(),
  });

  useEffect(() => {
    const isValid = isAccessTokenValid();
    setAuthenticated(isValid);

    if (!!myNdlaData.data && isValid && myNdlaData.data.personalData !== undefined) {
      const { personalData, examLockStatus } = myNdlaData.data;
      if (personalData?.role === "student") {
        setExamLock(examLockStatus?.value === true);
      }
      setUser({
        isModerator: isArenaModerator(personalData?.arenaGroups) && !config.enableNodeBB,
        ...personalData,
      });
      setLoaded(true);
      // Since we can't listen to cookies set a timeout to update context
      const timeoutMillis = millisUntilExpiration();
      window.setTimeout(() => {
        setAuthenticated(false);
      }, timeoutMillis);
    } else if (!myNdlaData.loading) {
      setLoaded(true);
    }
  }, [myNdlaData]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        authContextLoaded,
        user,
        examLock,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticationContext;
