/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext } from 'react';
import RedirectContext, { RedirectInfo } from './RedirectContext';

interface Props {
  code: number;
  children: ReactNode;
}

const Status = ({ code, children }: Props) => {
  const redirectContext = useContext<RedirectInfo | undefined>(RedirectContext);
  if (redirectContext) {
    redirectContext.status = code;
  }
  return <>{children}</>;
};

export default Status;
