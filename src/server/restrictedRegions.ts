/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ipAddr from "ipaddr.js";
import { getEnvironmentVariable } from "../config";
import { log } from "../util/logger/logger";

type ParsedCIDR = ReturnType<typeof ipAddr.parseCIDR>;

type RestrictedRegionMap = Record<string, ParsedCIDR[]>;

const ENV_NAME = "NDLA_RESTRICTED_REGION_CIDRS";

function validateRestrictedRegionMap(map: unknown): map is Record<string, string[]> {
  if (typeof map !== "object" || map === null || Array.isArray(map)) {
    return false;
  }

  return Object.entries(map).every(
    ([region, cidrs]) =>
      typeof region === "string" && Array.isArray(cidrs) && cidrs.every((cidr) => typeof cidr === "string"),
  );
}

function logValidationError() {
  log.warn(
    `There was a problem parsing '${ENV_NAME}' environment variable, format should be json object like {"oslo":["10.0.0.0/24","192.168.0.1/24"]}.`,
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

    return Object.entries(parsed).reduce<Record<string, ParsedCIDR[]>>((acc, [region, cidrs]) => {
      acc[region] = cidrs.map((cidr) => ipAddr.parseCIDR(cidr));
      return acc;
    }, {});
  } catch {
    logValidationError();
    return undefined;
  }
};

const envRestrictedRegionCidrs = parseRestrictedRegionEnv();
export const restrictedRegionCidrs: RestrictedRegionMap = envRestrictedRegionCidrs ?? {};
