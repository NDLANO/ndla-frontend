/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, createContext, useContext } from "react";

export type RestrictedModeState = {
  restricted: boolean;
  region?: string;
};

const defaultValue: RestrictedModeState = {
  restricted: false,
};

const RestrictedModeContext = createContext<RestrictedModeState>(defaultValue);

interface Props {
  children: ReactNode;
  value?: RestrictedModeState;
}

export const RestrictedModeProvider = ({ children, value }: Props) => {
  return <RestrictedModeContext value={value ?? defaultValue}>{children}</RestrictedModeContext>;
};

export const useRestrictedMode = () => useContext(RestrictedModeContext);
