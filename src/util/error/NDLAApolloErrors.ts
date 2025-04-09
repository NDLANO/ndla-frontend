/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GraphQLFormattedError } from "graphql";
import { Operation } from "@apollo/client";
import type { NetworkError } from "@apollo/client/errors";
import { NDLAError } from "./NDLAError";
import { getLogLevelFromStatusCode } from "../handleError";

export class NDLAGraphQLError extends NDLAError {
  constructor(baseError: GraphQLFormattedError, operation: Operation) {
    const message = `[GraphQL error]: ${baseError.message}`;
    super(message);

    const errorStatus = baseError.extensions?.status;

    if (typeof errorStatus === "number") {
      this.logLevel = getLogLevelFromStatusCode(errorStatus);
    }

    const operationInfo = {
      operationName: operation.operationName,
      variables: operation.variables,
    };

    this.logContext = {
      graphqlError: {
        operationInfo,
        message,
        locations: baseError.locations,
        path: baseError.path,
        extensions: baseError.extensions,
      },
    };
  }
}

export class NDLANetworkError extends NDLAError {
  constructor(baseError: NonNullable<NetworkError>, operation: Operation) {
    const message = `[Network error]: ${baseError.message}`;
    super(message);

    this.stack = baseError.stack;

    const operationInfo = {
      operationName: operation.operationName,
      variables: operation.variables,
    };

    this.logContext = {
      stack: baseError.stack,
      networkErrorMessage: baseError.message,
      cause: baseError.cause,
      graphqlError: {
        operationInfo,
      },
    };
  }
}
