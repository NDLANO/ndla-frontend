/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useContext } from "react";
import { ApolloError, DocumentNode, OperationVariables, TypedDocumentNode } from "@apollo/client";
import handleError from "../util/handleError";

export interface ServerErrorContext {
  error: string | undefined;
}

export class ErrorContextInfo {
  error: { [key: string]: ApolloError };
  constructor(serverErrorContext?: ServerErrorContext) {
    this.error = serverErrorContext?.error ? JSON.parse(serverErrorContext.error) : {};
  }

  getError(key: string): ApolloError | undefined {
    return this.error[key];
  }

  setError(key: string, error: ApolloError) {
    this.error[key] = error;
  }

  serialize(): ServerErrorContext {
    return { error: JSON.stringify(this.error) };
  }
}

const GQLErrorContext = createContext<ErrorContextInfo>(new ErrorContextInfo());

export const useApolloErrors = <TData extends any = any, TVariables extends OperationVariables = OperationVariables>(
  errors: ApolloError | undefined,
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
): ApolloError | undefined => {
  const operation = query.definitions.find((definition) => definition.kind === "OperationDefinition");
  const queryKey = operation?.name?.value;
  const errorContext = useContext(GQLErrorContext);
  if (!queryKey) {
    handleError(new Error("No operation name found when using useApolloErrors, seems like a bug..."));
    return errors;
  }

  if (errors) {
    errorContext.setError(queryKey, errors);
    return errors;
  }

  return errorContext.getError(queryKey);
};
export default GQLErrorContext;
