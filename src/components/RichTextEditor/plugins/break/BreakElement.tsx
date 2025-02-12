/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BREAK_ELEMENT_TYPE, ElementRenderer } from "@ndla/editor";

export const BreakElement: ElementRenderer = (props) => {
  const { element, attributes, children } = props;

  if (element.type !== BREAK_ELEMENT_TYPE) return undefined;

  return (
    <div {...attributes} contentEditable={false}>
      <br />
      {children}
    </div>
  );
};
