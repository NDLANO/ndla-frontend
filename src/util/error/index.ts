/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError } from "@apollo/client";
import { NDLAError } from "./NDLAError";

export type ErrorType = ApolloError | Error | NDLAError | string | unknown;
