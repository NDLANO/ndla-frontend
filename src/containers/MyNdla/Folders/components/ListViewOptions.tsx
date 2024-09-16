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
import { ToggleGroupItem, ToggleGroupRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ViewType } from "../FoldersPage";

const StyledToggleGroupRoot = styled(ToggleGroupRoot, {
  base: {
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
    <StyledToggleGroupRoot
      value={[type]}
      defaultValue={["list"]}
      onValueChange={(details) => {
        if (details.value[0]) {
          onTypeChange(details.value[0] as ViewType);
        }
      }}
    >
      <ToggleGroupItem
        value="list"
        variant="tertiary"
        aria-label={t("myNdla.listView")}
        title={t("myNdla.listView")}
        size="small"
      >
        <MenuLine />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="listLarger"
        variant="tertiary"
        aria-label={t("myNdla.detailView")}
        title={t("myNdla.detailView")}
        size="small"
      >
        <ListCheck />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="block"
        variant="tertiary"
        aria-label={t("myNdla.shortView")}
        title={t("myNdla.shortView")}
        size="small"
      >
        <GridFill />
      </ToggleGroupItem>
    </StyledToggleGroupRoot>
  );
};

export default memo(ListViewOptions, (prev, curr) => prev.type === curr.type);
