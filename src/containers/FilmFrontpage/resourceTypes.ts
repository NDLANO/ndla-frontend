/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  RESOURCE_TYPE_DOCUMENTARY,
  RESOURCE_TYPE_FEATURE_FILM,
  RESOURCE_TYPE_SERIES,
  RESOURCE_TYPE_SHORT_FILM,
} from "../../constants";

export interface MovieResourceType {
  id: string;
  name: string;
}

export const movieResourceTypes = [
  {
    name: "filmfrontpage.resourcetype.documentary",
    id: RESOURCE_TYPE_DOCUMENTARY,
  },
  {
    name: "filmfrontpage.resourcetype.featureFilm",
    id: RESOURCE_TYPE_FEATURE_FILM,
  },
  {
    name: "filmfrontpage.resourcetype.series",
    id: RESOURCE_TYPE_SERIES,
  },
  {
    name: "filmfrontpage.resourcetype.shortFilm",
    id: RESOURCE_TYPE_SHORT_FILM,
  },
];
