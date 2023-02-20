/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from 'react';

const ArticleConvertEnabledContext = createContext<boolean>(false);

interface Props {
  children: ReactNode;
  value?: boolean;
}

export const ArticleConverterEnabledProvider = ({
  children,
  value = false,
}: Props) => {
  return (
    <ArticleConvertEnabledContext.Provider value={value}>
      {children}
    </ArticleConvertEnabledContext.Provider>
  );
};

export const useArticleConverterEnabled = () => {
  const context = useContext(ArticleConvertEnabledContext);
  if (context === undefined) {
    return false;
  }
  return context;
};
