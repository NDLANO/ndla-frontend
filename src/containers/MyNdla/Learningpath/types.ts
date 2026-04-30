/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { ExternalFormValues } from "./components/ExternalStepForm";
import type { FolderFormValues } from "./components/FolderStepForm";
import type { ResourceFormValues } from "./components/ResourceStepForm";
import type { TextFormValues } from "./components/TextStepForm";

export type FormValues = TextFormValues | ExternalFormValues | ResourceFormValues | FolderFormValues;

export interface LocationState {
  focusStepId?: string;
}

export interface LearningPathOutletContext {
  language: string;
}
