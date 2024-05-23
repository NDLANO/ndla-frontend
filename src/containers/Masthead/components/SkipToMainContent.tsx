/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { colors, stackOrder } from "@ndla/core";

interface Props {
  skipToMainContentId: string;
}

const StyledSkipToMainContent = styled.a`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: ${colors.white};
  background: ${colors.brand.primary};
  left: auto;
  top: auto;
  width: 30%;
  height: auto;
  overflow: auto;
  margin: 10px 35%;
  padding: 5px;
  border-radius: 15px;
  border: 4px solid ${colors.brand.tertiary};
  text-align: center;
  font-size: 1.2em;
  z-index: ${stackOrder.popover};
  animation-name: fadeIn;
  animation-duration: 0.3s;
  transform: translateY(-150%);
  &:focus {
    transform: translateY(0);
  }
`;

const SkipToMainContent = ({ skipToMainContentId }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledSkipToMainContent tabIndex={0} href={`#${skipToMainContentId}`}>
      {t("masthead.skipToContent")}
    </StyledSkipToMainContent>
  );
};

export default SkipToMainContent;
