/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NormalizedCacheObject } from "@apollo/client";
import { ConfigType } from "./config";
import { LocaleValues } from "./constants";
import type { ManifestChunk } from "vite";

export type InitialProps = {
  articleId?: string;
  taxonomyId?: string;
  basename?: string;
  locale?: LocaleType;
  ltiData?: LtiData;
};

export interface WindowData {
  apolloState: NormalizedCacheObject;
  config: ConfigType;
  initialProps: InitialProps;
  ltiData?: LtiData;
  serverPath?: string;
  chunks?: ManifestChunk[];
  siteTheme?: SiteTheme;
  serverQuery?: {
    [key: string]: string | number | boolean | undefined | null;
  };
  serverResponse?: number;
}

export interface NDLAWindow {
  DATA: WindowData;
}

export interface Author {
  name: string;
  type: string;
}

export type LocaleType = (typeof LocaleValues)[number];

export type SiteTheme = "brand1" | "brand2" | "brand3" | "brand4" | "brand5";

export type Breadcrumb = { to: string; name: string };

export type CompetenceGoalsType = "LK06" | "LK20";

export type HeadingType = "h1" | "h2" | "h3" | "h4" | "h5";

export type LtiData = {
  content_item_return_url?: string;
  launch_presentation_return_url?: string;
  launch_presentation_document_target?: string;
  launch_presentation_width?: string;
  launch_presentation_height?: string;
  ext_content_return_types?: string;
  lti_message_type?: string;
  oauth_callback?: string;
  oauth_consumer_key?: string;
  oauth_signature?: string;
  oauth_signature_method?: string;
  oauth_timestamp?: string;
  oauth_version?: string;
  oauth_nonce?: string;
  data?: string;
};

export type LtiItem = {
  id: string | number;
  title?: string;
  url: string;
};

export interface OembedResponse {
  type: string;
  version: string;
  height: number;
  width: number;
  title: string;
  html: string;
  iframeSrc: string;
}

export type LogLevel = "error" | "warn" | "info";
