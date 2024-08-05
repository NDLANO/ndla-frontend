/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  skipToMainContentId: string;
}

const SkipLink = styled(SafeLinkButton, {
  base: {
    position: "absolute",
    top: "xsmall",
    left: "0",
    right: "0",
    marginBlock: "0",
    marginInline: "auto",
    zIndex: "skipLink",
    width: "fit-content",
    transform: "translateY(-150%)",
    _focus: {
      transform: "translateY(0%)",
    },
  },
});

const SkipToMainContent = ({ skipToMainContentId }: Props) => {
  const { t } = useTranslation();
  return (
    <SkipLink asAnchor to={`#${skipToMainContentId}`}>
      {t("masthead.skipToContent")}
    </SkipLink>
  );
};

export default SkipToMainContent;
