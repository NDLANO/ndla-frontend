/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { COPYRIGHTED } from '@ndla/licenses';
import { GQLCopyright } from '../../graphqlTypes';

type BaseCopyright = Pick<
  GQLCopyright,
  'creators' | 'processors' | 'rightsholders'
>;
export const licenseCopyrightToCopyrightType = <T extends BaseCopyright>(
  copyright: T | undefined,
) => {
  const processors = copyright?.processors ?? [];
  const rightsholders = copyright?.rightsholders ?? [];
  const creators = copyright?.creators ?? [];
  return {
    ...copyright,
    processors,
    rightsholders,
    creators,
  };
};

export const isCopyrighted = (license?: string) =>
  license?.toLowerCase() === COPYRIGHTED;
