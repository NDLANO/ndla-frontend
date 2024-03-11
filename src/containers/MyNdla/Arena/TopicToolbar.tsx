/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Plus } from "@ndla/icons/action";
import { SafeLinkButton } from "@ndla/safelink";
import { buttonCss, iconCss } from "../Folders/FoldersPage";

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const TopicButtons = () => {
  const { t } = useTranslation();
  return (
    <StyledListItem key="newTopic">
      <SafeLinkButton colorTheme="lighter" css={buttonCss} to="category/new" variant="ghost">
        <Plus css={iconCss} />
        {t("myNdla.arena.admin.category.form.newCategory")}
      </SafeLinkButton>
    </StyledListItem>
  );
};
