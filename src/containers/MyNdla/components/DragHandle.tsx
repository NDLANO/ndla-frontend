/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { Draggable } from "@ndla/icons";
import { IconButton, IconButtonProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends Omit<IconButtonProps, "type"> {
  sortableId: string;
  type: "folder" | "resource" | "category" | "learningpathstep";
  name: string;
}

const StyledDragHandle = styled(IconButton, {
  base: {
    touchAction: "none",
    _disabled: {
      display: "none",
    },
    tabletDown: {
      display: "none",
    },
  },
});

const DragHandle = ({ sortableId, type, name, ...rest }: Props) => {
  const { t } = useTranslation();
  const { listeners, setActivatorNodeRef } = useSortable({ id: sortableId });
  return (
    <StyledDragHandle
      tabIndex={0}
      {...rest}
      aria-label={t(`myNdla.${type}.dragHandle`, { name })}
      type={"button"}
      variant="clear"
      {...listeners}
      ref={setActivatorNodeRef}
    >
      <Draggable />
    </StyledDragHandle>
  );
};

export default DragHandle;
