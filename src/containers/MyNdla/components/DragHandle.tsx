/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLProps } from "react";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { Draggable } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends HTMLProps<HTMLButtonElement> {
  sortableId: string;
  type: "folder" | "resource" | "category";
  name: string;
}

const StyledDragHandle = styled(IconButton, {
  base: {
    touchAction: "none",
    tablet: {
      left: "-4xsmall",
      position: "absolute",
      translate: "-50px 20px",
    },
    _disabled: {
      display: "none",
    },
  },
});

const DragHandle = ({ sortableId, type, name, ...rest }: Props) => {
  const { t } = useTranslation();
  const { listeners, setActivatorNodeRef } = useSortable({ id: sortableId });
  return (
    <StyledDragHandle
      {...rest}
      aria-label={t(`myNdla.${type}.dragHandle`, { name })}
      type={"button"}
      // TODO: Should this be another variant?
      variant="clear"
      tabIndex={0}
      {...listeners}
      ref={setActivatorNodeRef}
    >
      <Draggable />
    </StyledDragHandle>
  );
};

export default DragHandle;
