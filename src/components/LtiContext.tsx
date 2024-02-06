/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from "react";
import { LtiData } from "../interfaces";

interface LtiContextType {
  ltiData?: LtiData;
}

const LtiContext = createContext<LtiContextType | undefined>(undefined);

interface Props {
  ltiData?: LtiData;
  children: ReactNode;
}

export const LtiContextProvider = ({ ltiData, children }: Props) => (
  <LtiContext.Provider value={{ ltiData }}>{children}</LtiContext.Provider>
);

export const useLtiData = () => {
  const context = useContext(LtiContext);
  return context;
};
