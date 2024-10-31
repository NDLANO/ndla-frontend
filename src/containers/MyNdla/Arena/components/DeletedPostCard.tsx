/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledDeletedCard = styled("div", {
  base: {
    backgroundColor: "surface.disabled.subtle",
    borderColor: "stroke.info",
    border: "1px solid",
    borderRadius: "xsmall",
    padding: "medium",
  },
});

const DeletedPostCard = () => {
  const { t } = useTranslation();
  return (
    <StyledDeletedCard>
      <Text>{t("myNdla.arena.posts.deleted")}</Text>
    </StyledDeletedCard>
  );
};

export default DeletedPostCard;
