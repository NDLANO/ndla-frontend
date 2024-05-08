/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";

interface Props {
  children: (id: string) => React.ReactNode;
}

export const StableId = ({ children }: Props) => {
  const id = useId();
  return children(id);
};
