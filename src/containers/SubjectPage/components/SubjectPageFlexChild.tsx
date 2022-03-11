/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactElement } from 'react';
import { SubjectFlexChild } from '@ndla/ui';

interface Props {
  children: ReactElement;
  twoColumns: boolean;
}

export const SubjectPageFlexChild = ({ children, twoColumns = false }: Props) =>
  twoColumns ? <SubjectFlexChild>{children}</SubjectFlexChild> : children;

export default SubjectPageFlexChild;
