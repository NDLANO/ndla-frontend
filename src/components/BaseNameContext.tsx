/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from "react";

const BaseNameContext = createContext<string>("");

interface Props {
  children: ReactNode;
  value?: string;
}

const BaseNameProvider = ({ children, value = "" }: Props) => {
  return <BaseNameContext value={value}>{children}</BaseNameContext>;
};

const useBaseName = () => {
  const context = useContext(BaseNameContext);
  if (context === undefined) {
    throw new Error("useBaseName must be used within a BaseNameProvider");
  }
  return context;
};

export { useBaseName, BaseNameProvider };
