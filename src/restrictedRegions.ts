/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// TODO: Temporary test map. Replace with real CIDR ranges/regions later.
export const restrictedRegionCidrs = {
  "193.168.156.0/24": "jonas",
} as const;

export type RestrictedRegion = (typeof restrictedRegionCidrs)[keyof typeof restrictedRegionCidrs];
