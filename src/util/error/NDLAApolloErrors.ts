/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  ApolloLink,
  LocalStateError,
  OperationVariables,
  ServerError,
  ServerParseError,
  UnconventionalError,
} from "@apollo/client";
import { GraphQLFormattedError } from "graphql";
import { getLogLevelFromStatusCode } from "../handleError";
import { NDLAError } from "./NDLAError";

interface OperationInfo {
  operationName: string | undefined;
  variables: OperationVariables;
  extensions: Record<string, any>;
}

class BaseGraphQLError extends NDLAError {
  operationInfo: OperationInfo;
  constructor(name: string, error: GraphQLFormattedError, operation: ApolloLink.Operation) {
    const message = `[${name} error]: ${error.message}`;
    super(message);
    this.operationInfo = {
      operationName: operation.operationName,
      variables: operation.variables,
      extensions: operation.extensions,
    };
  }
}

export class NDLAGraphQLError extends BaseGraphQLError {
  constructor(error: GraphQLFormattedError, operation: ApolloLink.Operation) {
    super("GraphQL", error, operation);

    const errorStatus = error.extensions?.status;

    if (typeof errorStatus === "number") {
      this.logLevel = getLogLevelFromStatusCode(errorStatus);
    }

    this.logContext = {
      graphqlError: {
        operationInfo: this.operationInfo,
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
      },
    };
  }
}

export class ApolloNetworkError extends BaseGraphQLError {
  constructor(error: NonNullable<ServerError>, operation: ApolloLink.Operation) {
    super("Network", error, operation);

    this.stack = error.stack;

    this.logContext = {
      stack: error.stack,
      networkErrorMessage: error.message,
      cause: error.cause,
      graphqlError: {
        operationInfo: this.operationInfo,
      },
    };
  }
}

export class ApolloLocalStateError extends BaseGraphQLError {
  constructor(error: LocalStateError, operation: ApolloLink.Operation) {
    super("Local State", error, operation);
    this.stack = error.stack;
    this.logContext = {
      stack: error.stack,
      cause: error.cause,
      path: error.path,
      graphqlError: { operationInfo: this.operationInfo },
    };
  }
}

export class ApolloServerParseError extends BaseGraphQLError {
  constructor(error: ServerParseError, operation: ApolloLink.Operation) {
    super("Server parse", error, operation);
    this.stack = error.stack;
    this.logLevel = getLogLevelFromStatusCode(error.statusCode);

    this.logContext = {
      stack: error.stack,
      cause: error.cause,
      bodyText: error.bodyText,
      graphqlError: { operationInfo: this.operationInfo },
    };
  }
}

export class ApolloUnconventionalError extends BaseGraphQLError {
  constructor(error: UnconventionalError, operation: ApolloLink.Operation) {
    super("Unconventional", error, operation);
    this.stack = error.stack;
    this.logContext = {
      stack: error.stack,
      cause: error.cause,
      graphqlError: { operationInfo: this.operationInfo },
    };
  }
}
