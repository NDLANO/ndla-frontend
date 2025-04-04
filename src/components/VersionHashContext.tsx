/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from "react";

export const defaultValue = "default";
const VersionHashContext = createContext<string>(defaultValue);

interface Props {
  children: ReactNode;
  value?: string;
}

export const VersionHashProvider = ({ children, value = defaultValue }: Props) => {
  return <VersionHashContext value={value}>{children}</VersionHashContext>;
};

export const useVersionHash = () => {
  const context = useContext(VersionHashContext);
  if (context === undefined) {
    return defaultValue;
  }
  return context;
};
