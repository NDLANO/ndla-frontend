/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface DrawerContextType {
  shouldCloseLevel: boolean;
  setShouldCloseLevel: () => void;
  setLevelClosed: () => void;
}
const DrawerContext = createContext<DrawerContextType>({
  shouldCloseLevel: false,
  setShouldCloseLevel: () => {},
  setLevelClosed: () => {},
});

interface Props {
  children: ReactNode;
}

export const DrawerProvider = ({ children }: Props) => {
  const [shouldCloseLevel, _setShouldCloseLevel] = useState(false);

  const setShouldCloseLevel = useCallback(() => _setShouldCloseLevel(true), []);
  const setLevelClosed = useCallback(() => _setShouldCloseLevel(false), []);

  return <DrawerContext value={{ shouldCloseLevel, setShouldCloseLevel, setLevelClosed }}>{children}</DrawerContext>;
};

export const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawerContext must be used within a DrawerProvider");
  }
  return context;
};
