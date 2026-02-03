/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckLine, FileCopyLine } from "@ndla/icons";
import { Heading, IconButton, MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isCopyrighted } from "./licenseHelpers";

const StyledDiv = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const CopyBlockWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledMessageBox = styled(MessageBox, {
  base: {
    width: "100%",
  },
});

interface Props {
  stringToCopy: string | undefined;
  license: string | undefined;
}

export const CopyBlock = ({ stringToCopy, license }: Props) => {
  const { t } = useTranslation();
  const [hasCopied, setHasCopied] = useState(false);

  const handleClick = useCallback(async () => {
    if (!stringToCopy || hasCopied) return;
    try {
      await navigator.clipboard.writeText(stringToCopy);
      setHasCopied(true);
    } catch (_) {
      setHasCopied(false);
    }
  }, [hasCopied, stringToCopy]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (hasCopied) {
      timeout = setTimeout(() => setHasCopied(!hasCopied), 10000);
    }
    return () => window.clearTimeout(timeout);
  }, [hasCopied]);

  if (isCopyrighted(license) || !stringToCopy) return null;
  return (
    <CopyBlockWrapper>
      <Heading asChild consumeCss textStyle="label.large" fontWeight="bold">
        <h4>{t("licenseBox.sourceTitle")}</h4>
      </Heading>
      <StyledDiv>
        <StyledMessageBox>{stringToCopy}</StyledMessageBox>
        <IconButton
          variant="secondary"
          onClick={handleClick}
          aria-label={hasCopied ? t("license.hasCopiedTitle") : t("license.copyTitle")}
        >
          {hasCopied ? <CheckLine /> : <FileCopyLine />}
        </IconButton>
      </StyledDiv>
    </CopyBlockWrapper>
  );
};
