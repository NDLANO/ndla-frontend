/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from "react";

const PrettyUrlsContext = createContext<boolean>(false);

interface Props {
  children: ReactNode;
  value?: boolean;
}

export const PrettyUrlsProvider = ({ children, value = false }: Props) => {
  return <PrettyUrlsContext.Provider value={value}>{children}</PrettyUrlsContext.Provider>;
};

export const useEnablePrettyUrls = () => {
  const context = useContext(PrettyUrlsContext);
  if (context === undefined) {
    return false;
  }
  return context;
};
