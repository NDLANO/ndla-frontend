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
import styled from "@emotion/styled";
import { breakpoints, mq, spacing } from "@ndla/core";
import { DragVertical } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";

interface Props extends HTMLProps<HTMLButtonElement> {
  sortableId: string;
  type: "folder" | "resource" | "category";
  name: string;
}

const StyledDragHandle = styled(IconButton)`
  touch-action: none;
  ${mq.range({ from: breakpoints.tablet })} {
    position: absolute;
    left: -${spacing.xxsmall};
    transform: translateX(-100%);
  }
  :disabled {
    display: none;
  }
`;

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
      <DragVertical />
    </StyledDragHandle>
  );
};

export default DragHandle;
