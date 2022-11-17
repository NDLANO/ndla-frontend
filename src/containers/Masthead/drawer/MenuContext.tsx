/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from 'react';

type MenuContextType = [
  VoidFunction[],
  Dispatch<SetStateAction<VoidFunction[]>>,
];

const MenuContext = createContext<MenuContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const MenuProvider = ({ children }: Props) => {
  const state = useState<VoidFunction[]>([]);

  return <MenuContext.Provider value={state}>{children}</MenuContext.Provider>;
};

const useMenuContext = () => {
  const context = useContext<MenuContextType | undefined>(MenuContext);
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuContext');
  }

  const [closeFuncs, setCloseFuncs] = context;

  const registerClose = useCallback(
    (func: VoidFunction) => {
      setCloseFuncs(prev => prev.concat(func));
    },
    [setCloseFuncs],
  );

  const close = useCallback(() => {
    closeFuncs[closeFuncs.length - 1]?.();
    setCloseFuncs(prev => prev.slice(0, prev.length - 1));
  }, [closeFuncs, setCloseFuncs]);

  return { close, registerClose };
};

export { MenuProvider, useMenuContext };
