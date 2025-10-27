/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useEffect, useState } from "react";
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

export const AuthenticationContext = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [authContextLoaded, setLoaded] = useState(false);
  const [user, setUser] = useState<GQLMyNdlaPersonalDataFragmentFragment | undefined>(undefined);
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
      setUser(personalData);
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
