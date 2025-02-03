/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LeafRenderer } from "@ndla/editor";

export const MarkLeaf: LeafRenderer = (props) => {
  const { attributes, children, leaf } = props;

  let ret;
  if (leaf.bold) {
    ret = <strong {...attributes}>{ret || children}</strong>;
  }
  if (leaf.italic) {
    ret = <em {...attributes}>{ret || children}</em>;
  }
  if (leaf.sup) {
    ret = <sup {...attributes}>{ret || children}</sup>;
  }
  if (leaf.sub) {
    ret = <sub {...attributes}>{ret || children}</sub>;
  }
  if (leaf.underlined) {
    ret = <u {...attributes}>{ret || children}</u>;
  }
  if (leaf.code) {
    ret = <code {...attributes}>{ret || children}</code>;
  }
  if (ret) {
    return ret;
  }

  return undefined;
};
