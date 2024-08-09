/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";
import { MenuLine } from "@ndla/icons/action";
import { GridFill } from "@ndla/icons/common";
import { ListCheck } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { ViewType } from "../FoldersPage";

const StyledDisplayOptionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const HiddenOnMobileIconButton = styled(IconButton)`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

interface Props {
  onTypeChange: (type: ViewType) => void;
  type: ViewType;
}

const ListViewOptions = ({ onTypeChange, type }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledDisplayOptionsContainer>
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
      <HiddenOnMobileIconButton
        // TODO: Fix handling of active according to design
        variant={type === "block" ? "primary" : "tertiary"}
        onClick={() => onTypeChange("block")}
        aria-label={t("myNdla.shortView")}
        title={t("myNdla.shortView")}
      >
        <GridFill />
      </HiddenOnMobileIconButton>
    </StyledDisplayOptionsContainer>
  );
};

export default memo(ListViewOptions, (prev, curr) => prev.type === curr.type);
