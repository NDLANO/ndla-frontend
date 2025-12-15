/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import ipAddr from "ipaddr.js";
import { getEnvironmentVariable } from "../../config";
import type { RestrictedModeState } from "../../components/RestrictedModeContext";
import { restrictedRegionCidrs } from "../restrictedRegions";

const ALWAYS_RESTRICTED = getEnvironmentVariable("NDLA_ALWAYS_RESTRICTED", false) as boolean;

const getClientIp = (req: Request): string | undefined => {
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (!xForwardedFor) return undefined;

  if (Array.isArray(xForwardedFor)) {
    return xForwardedFor[0];
  }

  return xForwardedFor.split(",")[0]?.trim();
};

const detectRegionFromIp = (ip: string | undefined): string | undefined => {
  if (!ip) return undefined;
  try {
    const parsedIp = ipAddr.parse(ip);
    for (const [region, cidr] of Object.entries(restrictedRegionCidrs)) {
      if (parsedIp.kind() === cidr[0].kind() && parsedIp.match(cidr)) {
        return region;
      }
    }
  } catch {
    // Ignore invalid IPs
  }
  return undefined;
};

export const isRestrictedMode = (req: Request): RestrictedModeState => {
  const clientIp = getClientIp(req);
  const region = detectRegionFromIp(clientIp);

  return {
    restricted: ALWAYS_RESTRICTED || req.query?.ndla_restricted === "1" || !!region,
    region,
  };
};
