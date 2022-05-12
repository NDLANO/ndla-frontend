/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import RedirectContext, { RedirectInfo } from './RedirectContext';
/**
 * The react-router Redirect component does'nt work with external
 * urls. So we use this helper component to handle it for us.
 */

interface Props {
  to: string;
}

interface Props {
  to: string;
}
const RedirectExternal = ({ to }: Props) => {
  const context = useContext<RedirectInfo | undefined>(RedirectContext);
  if (context) {
    context.url = to;
  } else {
    window.location.replace(to);
  }
  return null;
};

export default RedirectExternal;
