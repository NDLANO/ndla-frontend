/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from 'react';

const ArticleConverterContext = createContext<boolean>(false);

interface Props {
  children: ReactNode;
  value?: boolean;
}

export const ArticleConverterProvider = ({
  children,
  value = false,
}: Props) => {
  return (
    <ArticleConverterContext.Provider value={value}>
      {children}
    </ArticleConverterContext.Provider>
  );
};

export const useDisableConverter = () => {
  const context = useContext(ArticleConverterContext);
  if (context === undefined) {
    return false;
  }
  return context;
};
