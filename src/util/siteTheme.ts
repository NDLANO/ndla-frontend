/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HeroVariant } from "@ndla/primitives";
import { SiteTheme } from "../interfaces";

const siteThemeToHeroMap: Record<SiteTheme, HeroVariant> = {
  brand1: "brand1Moderate",
  brand2: "brand2Moderate",
  brand3: "brand3Moderate",
  brand4: "brand4Moderate",
  brand5: "brand5Moderate",
};

export const siteThemeToHeroVariant = (theme?: SiteTheme): HeroVariant => {
  return siteThemeToHeroMap[theme ?? "brand1"];
};

const SITE_THEMES: SiteTheme[] = ["brand5", "brand1", "brand2", "brand3", "brand4"] as const;

export const getSiteTheme = () => {
  const theme = SITE_THEMES[Math.floor(Math.random() * SITE_THEMES.length)];
  return theme;
};
