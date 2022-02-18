/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLConceptCopyright, GQLCopyright } from '../../graphqlTypes';

export const licenseCopyrightToCopyrightType = (
  copyright: GQLCopyright | GQLConceptCopyright | undefined,
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
