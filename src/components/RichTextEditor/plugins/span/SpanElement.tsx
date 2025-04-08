/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SPAN_ELEMENT_TYPE, ElementRenderer } from "@ndla/editor";
import { InlineBugfix } from "@ndla/editor-components";

export const SpanElement: ElementRenderer = (props) => {
  const { element, attributes, children } = props;

  if (element.type !== SPAN_ELEMENT_TYPE) return undefined;

  return (
    <span {...attributes} lang={element.data.lang}>
      <InlineBugfix />
      {children}
      <InlineBugfix />
    </span>
  );
};
