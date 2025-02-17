/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ExternalFormValues } from "./components/ExternalStepForm";
import { ResourceFormValues } from "./components/ResourceStepForm";
import { TextFormValues } from "./components/TextStepForm";

export type FormValues = TextFormValues | ExternalFormValues | ResourceFormValues;
