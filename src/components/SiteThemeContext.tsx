/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from "react";
import { SiteTheme } from "../interfaces";

const SiteThemeContext = createContext<SiteTheme>("brand1");

interface Props {
  children: ReactNode;
  value: SiteTheme | undefined;
}

export const SiteThemeProvider = ({ children, value }: Props) => {
  return <SiteThemeContext.Provider value={value ?? "brand1"}>{children}</SiteThemeContext.Provider>;
};

export const useSiteTheme = (): SiteTheme => {
  const context = useContext(SiteThemeContext);
  return context ?? "brand1";
};
