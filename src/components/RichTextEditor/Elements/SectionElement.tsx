/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementRenderer } from "@ndla/editor";

export const SectionElement: ElementRenderer = (props) => {
  const { element, attributes, children } = props;

  if (element.type === "section") {
    return <section {...attributes}>{children}</section>;
  }
  return undefined;
};
