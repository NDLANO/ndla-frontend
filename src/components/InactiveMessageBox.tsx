/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { InformationLine } from "@ndla/icons";
import { MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";

const StyledMessageBox = styled(MessageBox, {
  base: {
    width: "100%",
  },
});

export const InactiveMessageBox = () => {
  const { t } = useTranslation();
  return (
    <StyledMessageBox variant="warning">
      <InformationLine />
      {t("archivedPage")}
    </StyledMessageBox>
  );
};
