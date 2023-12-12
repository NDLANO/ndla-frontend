/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from 'react';

interface UserAgentType {
  isMobile: boolean;
  isMacOs: boolean;
}

const UserAgentContext = createContext<UserAgentType | undefined>(undefined);

interface Props {
  children?: ReactNode;
  value?: any;
}

export const UserAgentProvider = ({ children, value }: Props) => (
  <UserAgentContext.Provider value={value}>
    {children}
  </UserAgentContext.Provider>
);

export const useUserAgent = () => {
  const context = useContext(UserAgentContext);
  return context;
};
