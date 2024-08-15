/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { MenuLine } from "@ndla/icons/action";
import { GridFill } from "@ndla/icons/common";
import { ListCheck } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ViewType } from "../FoldersPage";

const ListViewOptionsContainer = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    marginInlineStart: "auto",
  },
});

interface Props {
  onTypeChange: (type: ViewType) => void;
  type: ViewType;
}

const ListViewOptions = ({ onTypeChange, type }: Props) => {
  const { t } = useTranslation();
  return (
    <ListViewOptionsContainer>
      <IconButton
        // TODO: Fix handling of active according to design
        variant={type === "list" ? "primary" : "tertiary"}
        onClick={() => onTypeChange("list")}
        aria-label={t("myNdla.listView")}
        title={t("myNdla.listView")}
      >
        <MenuLine />
      </IconButton>
      <IconButton
        // TODO: Fix handling of active according to design
        variant={type === "listLarger" ? "primary" : "tertiary"}
        onClick={() => onTypeChange("listLarger")}
        aria-label={t("myNdla.detailView")}
        title={t("myNdla.detailView")}
      >
        <ListCheck />
      </IconButton>
      <IconButton
        // TODO: Fix handling of active according to design
        variant={type === "block" ? "primary" : "tertiary"}
        onClick={() => onTypeChange("block")}
        aria-label={t("myNdla.shortView")}
        title={t("myNdla.shortView")}
      >
        <GridFill />
      </IconButton>
    </ListViewOptionsContainer>
  );
};

export default memo(ListViewOptions, (prev, curr) => prev.type === curr.type);
