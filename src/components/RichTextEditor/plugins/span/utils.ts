/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SPAN_ELEMENT_TYPE, SpanElement } from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";

export const defaultSpanBlock = (data: SpanElement["data"] = {}) =>
  slatejsx("element", { type: SPAN_ELEMENT_TYPE, data }, { text: "" }) as SpanElement;

export const languages = [
  "no",
  "de",
  "es",
  "se",
  "sma",
  "zh",
  "en",
  "ar",
  "prs",
  "fr",
  "heb",
  "la",
  "pli",
  "san",
  "so",
  "ti",
] as const;
