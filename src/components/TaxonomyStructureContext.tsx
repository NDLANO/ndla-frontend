/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, ReactNode, useContext } from 'react';

const TaxonomyStructureContext = createContext<boolean>(false);

interface Props {
  children: ReactNode;
  value?: boolean;
}

export const TaxonomyStructureProvider = ({
  children,
  value = false,
}: Props) => {
  return (
    <TaxonomyStructureContext.Provider value={value}>
      {children}
    </TaxonomyStructureContext.Provider>
  );
};

export const useEnableTaxStructure = () => {
  const context = useContext(TaxonomyStructureContext);
  if (context === undefined) {
    return false;
  }
  return context;
};
