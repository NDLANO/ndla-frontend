/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from "react";

const LtiContext = createContext<boolean>(false);

interface Props {
  children?: ReactNode;
}

export const LtiContextProvider = ({ children }: Props) => (
  <LtiContext.Provider value={true}>{children}</LtiContext.Provider>
);

export const useLtiContext = () => {
  const context = useContext(LtiContext);
  return context;
};
