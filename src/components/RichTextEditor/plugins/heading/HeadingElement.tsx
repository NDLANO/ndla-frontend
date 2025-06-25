/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementRenderer } from "@ndla/editor";
import { Heading } from "@ndla/primitives";

export const HeadingElement: ElementRenderer = (props) => {
  const { element, attributes, children } = props;
  if (element.type === "heading") {
    const El = `h${element.level}` as const;
    const style = element.level <= 2 ? "heading.medium" : "heading.small";
    return (
      <Heading {...attributes} textStyle={style} asChild consumeCss>
        <El>{children}</El>
      </Heading>
    );
  }
  return undefined;
};
