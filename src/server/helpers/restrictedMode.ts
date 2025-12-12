/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Request } from "express";
import url from "url";
import ipaddr from "ipaddr.js";
import { getEnvironmentVariable } from "../../config";
import { restrictedRegionCidrs } from "../../restrictedRegions";
import type { RestrictedModeState } from "../../components/RestrictedModeContext";

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
    const parsedIp = ipaddr.parse(ip);
    for (const [cidr, region] of Object.entries(restrictedRegionCidrs)) {
      const parsedCidr = ipaddr.parseCIDR(cidr);
      if (parsedIp.kind() === "ipv4" && parsedCidr[0].kind() === "ipv4") {
        if ((parsedIp as ipaddr.IPv4).match(parsedCidr as [ipaddr.IPv4, number])) {
          return region;
        }
      } else if (parsedIp.kind() === "ipv6" && parsedCidr[0].kind() === "ipv6") {
        if ((parsedIp as ipaddr.IPv6).match(parsedCidr as [ipaddr.IPv6, number])) {
          return region;
        }
      }
    }
  } catch {
    // Ignore invalid IPs
  }
  return undefined;
};

const restrictedQueryParam = (req: Request): boolean => {
  const urlParts = url.parse(req.url ?? "", true);
  if (urlParts.query && urlParts.query.ndla_restricted) {
    return urlParts.query.ndla_restricted === "1";
  }
  return false;
};

export const isRestrictedMode = (req: Request): RestrictedModeState => {
  const alwaysRestricted = getEnvironmentVariable("NDLA_ALWAYS_RESTRICTED", false) as boolean;
  const queryParamRestricted = restrictedQueryParam(req);
  const clientIp = getClientIp(req);
  const region = detectRegionFromIp(clientIp);

  return {
    restricted: alwaysRestricted || queryParamRestricted || !!region,
    region,
  };
};
