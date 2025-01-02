/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface FormValuesMap {
  text: { type: "text"; title: string; introduction: string; description: string };
  resource: { type: "resource"; title: string; embedUrl: string };
  external: { type: "external"; title: string; url: string; introduction: string; shareable: boolean };
  folder: { type: "folder"; title: string };
}

export type FormKeys = keyof FormValuesMap;

export type FormValues = FormValuesMap[keyof FormValuesMap];
