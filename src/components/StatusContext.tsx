/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createContext, ReactNode, useEffect, useState } from 'react';

interface StatusContextProvider {
  examLock?: boolean;
}

export const StatusContext = createContext<StatusContextProvider>({});

interface Props {
  children: ReactNode;
  initialValue?: string;
}

export const StatusProvider = ({ children }: Props) => {
  const [examLock, setExamLock] = useState(true);

  useEffect(() => {}, []);

  return (
    <StatusContext.Provider value={{ examLock }}>
      {children}
    </StatusContext.Provider>
  );
};
