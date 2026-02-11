/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { ArrowUpDownLine, CheckLine, CloseLine } from "@ndla/icons";
import {
  Button,
  IconButton,
  SelectClearTrigger,
  SelectContent,
  SelectControl,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useStableSearchParams } from "../../../../util/useStableSearchParams";
import { SORT_CONTENT_TYPE, SORT_LAST_ADDED, SORT_NAME_ASC, SORT_NAME_DESC } from "../util";

const sortOptions = [
  { value: SORT_NAME_ASC, transKey: "nameAsc" },
  { value: SORT_NAME_DESC, transKey: "nameDesc" },
  { value: SORT_LAST_ADDED, transKey: "lastAdded" },
  { value: SORT_CONTENT_TYPE, transKey: "contentType" },
];

const StyledSelectTrigger = styled(SelectTrigger, {
  base: {
    width: "max-content",
  },
});

export const ResourceSortOption = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useStableSearchParams();
  const selectedSort = searchParams.get("sort");

  const collection = useMemo(
    () =>
      createListCollection({
        items: sortOptions,
        itemToString: (item) => t(`myNdla.folder.sortOption.${item.transKey}`),
        itemToValue: (item) => item.value,
      }),
    [t],
  );

  return (
    <SelectRoot
      collection={collection}
      value={selectedSort ? [selectedSort] : []}
      onValueChange={(value) => setSearchParams({ sort: value.value[0] }, { preventScrollReset: true })}
      positioning={{ sameWidth: true }}
    >
      <SelectLabel srOnly>{t("myNdla.folder.sortList")}</SelectLabel>
      <SelectControl>
        <StyledSelectTrigger asChild>
          <Button variant="secondary">
            <SelectValueText placeholder={t("myNdla.folder.sortList")} />
            <ArrowUpDownLine />
          </Button>
        </StyledSelectTrigger>
        <SelectClearTrigger asChild>
          <IconButton variant="secondary">
            <CloseLine />
          </IconButton>
        </SelectClearTrigger>
      </SelectControl>
      <SelectContent>
        {collection.items.map((option) => (
          <SelectItem key={option.value} item={option}>
            <SelectItemText>{t(`myNdla.folder.sortOption.${option.transKey}`)}</SelectItemText>
            <SelectItemIndicator>
              <CheckLine />
            </SelectItemIndicator>
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
