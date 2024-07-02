/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, misc, spacing } from "@ndla/core";
import { Text } from "@ndla/typography";

const StyledDeletedCard = styled.div`
  background-color: ${colors.brand.greyLightest};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  padding: ${spacing.normal};
  margin-bottom: ${spacing.normal};
`;

const DeletedPostCard = () => {
  const { t } = useTranslation();
  return (
    <StyledDeletedCard>
      <Text textStyle="content-alt" margin="none">
        {t("myNdla.arena.posts.deleted")}
      </Text>
    </StyledDeletedCard>
  );
};

export default DeletedPostCard;
