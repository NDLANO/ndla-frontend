/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  isLoading: boolean;
}

const WhileLoading = ({ fallback, children, isLoading }: Props) => {
  if (isLoading) return fallback;
  return children;
};

export default WhileLoading;
