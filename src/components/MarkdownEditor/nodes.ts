/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Klass, LexicalNode } from 'lexical';
import { LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';

export const editorNodes: Array<Klass<LexicalNode>> = [
  ListNode,
  ListItemNode,
  LinkNode,
];
