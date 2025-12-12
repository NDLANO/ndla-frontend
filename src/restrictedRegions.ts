/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getEnvironmentVariable } from "./config";
import { log } from "./util/logger/logger";

type RestrictedRegionMap = Record<string, string>;

const ENV_NAME = "NDLA_RESTRICTED_REGION_CIDRS";

function validateRestrictedRegionMap(map: any): map is RestrictedRegionMap {
  if (typeof map !== "object" || map === null || Array.isArray(map)) {
    return false;
  }
  return Object.entries(map).every(([cidr, region]) => typeof cidr === "string" && typeof region === "string");
}

function logValidationError() {
  log.warn(
    `There was a problem parsing '${ENV_NAME}' environment variable, format should be json object like {"10.0.0.0/24":"oslo"}.`,
  );
}

const parseRestrictedRegionEnv = (): RestrictedRegionMap | undefined => {
  const raw = getEnvironmentVariable(ENV_NAME);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw);
    if (!validateRestrictedRegionMap(parsed)) {
      logValidationError();
      return undefined;
    }

    return parsed;
  } catch {
    logValidationError();
    return undefined;
  }
};

const envRestrictedRegionCidrs = parseRestrictedRegionEnv();
export const restrictedRegionCidrs: RestrictedRegionMap = envRestrictedRegionCidrs ?? {};
