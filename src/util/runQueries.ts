/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";
import { useApolloErrors } from "../components/GQLErrorContext";

export function useGraphQuery<TData extends any = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const result = useQuery(query, {
    errorPolicy: "all",
    ssr: true,
    ...options,
  });

  // Apollo client does not cache errors, we need some way to pass errors to the client if they occur on the server side
  const error = useApolloErrors(result.error, query);

  return { ...result, error };
}
