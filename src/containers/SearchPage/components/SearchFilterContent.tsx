/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { breakpoints, mq, spacing } from "@ndla/core";
import { Cross } from "@ndla/icons/action";
import { Grid } from "@ndla/icons/common";
import { ListCircle } from "@ndla/icons/editor";
import { ViewType } from "./searchTypes";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: ${spacing.xxsmall};
  ${mq.range({ until: breakpoints.tablet })} {
    display: none;
  }
`;

const ItemWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
  flex-wrap: wrap;
`;

interface Item {
  label: string;
  value: string;
  selected?: boolean;
}

interface Props {
  items: Item[];
  viewType: ViewType;
  onChangeViewType: (viewType: ViewType) => void;
  onFilterToggle: (value: string) => void;
}

export const SearchFilterContent = ({ items, viewType, onChangeViewType, onFilterToggle }: Props) => {
  const { t } = useTranslation();
  return (
    <Container>
      <ItemWrapper>
        {items.map((item) => (
          <ButtonV2
            key={item.value}
            shape="pill"
            onClick={() => onFilterToggle(item.value)}
            colorTheme={item.selected ? "primary" : "greyLighter"}
          >
            {item.label}
            {item.selected && <Cross />}
          </ButtonV2>
        ))}
      </ItemWrapper>
      <ButtonWrapper>
        <IconButtonV2
          variant={viewType === "grid" ? "solid" : "ghost"}
          onClick={() => onChangeViewType("grid")}
          colorTheme="greyLighter"
          aria-label={t("searchPage.resultType.gridView")}
          title={t("searchPage.resultType.gridView")}
        >
          <Grid />
        </IconButtonV2>
        <IconButtonV2
          variant={viewType === "list" ? "solid" : "ghost"}
          onClick={() => onChangeViewType("list")}
          colorTheme="greyLighter"
          aria-label={t("searchPage.resultType.listView")}
          title={t("searchPage.resultType.listView")}
        >
          <ListCircle />
        </IconButtonV2>
      </ButtonWrapper>
    </Container>
  );
};
