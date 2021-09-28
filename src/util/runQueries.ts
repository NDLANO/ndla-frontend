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
} from '@apollo/client';
import { useTranslation } from 'react-i18next';

export function useGraphQuery<TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> {
  const {
    i18n: { language },
  } = useTranslation();

  const result = useQuery(query, {
    errorPolicy: 'all',
    ...(language ? { 'accept-language': language } : {}),
    ...options,
  });

  return result;
}
