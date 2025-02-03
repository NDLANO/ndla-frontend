/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementRenderer } from "@ndla/editor";
import { OrderedList, UnOrderedList } from "@ndla/primitives";

export const ListElement: ElementRenderer = (props) => {
  const { element, attributes, children } = props;

  if (element.type === "list-item") {
    return <li {...attributes}>{children}</li>;
  }

  if (element.type !== "list") {
    return undefined;
  }

  if (element.listType === "letter-list") {
    return (
      <OrderedList variant="letters" {...attributes}>
        {children}
      </OrderedList>
    );
  } else if (element.listType === "numbered-list") {
    return (
      <OrderedList variant="numbers" {...attributes}>
        {children}
      </OrderedList>
    );
  } else {
    return <UnOrderedList {...attributes}>{children}</UnOrderedList>;
  }
};
