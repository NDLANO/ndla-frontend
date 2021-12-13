/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactNode } from 'react';
import { Route } from 'react-router-dom';

interface Props {
  code: number;
  children: ReactNode;
}

const Status = ({ code, children }: Props) => (
  <Route
    render={({ staticContext }) => {
      const context = staticContext;
      if (staticContext) {
        //@ts-ignore
        context.status = code;
      }
      return children;
    }}
  />
);

export default Status;
