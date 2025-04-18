/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router-dom";
import { HTMLArkProps } from "@ark-ui/react";
import { GlobalLine } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { JsxStyleProps } from "@ndla/styled-system/types";
import { constructNewPath } from "../../util/urlHelper";

interface Props extends JsxStyleProps, HTMLArkProps<"button"> {}

export const LanguageSelector = (props: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const href = useHref(location);

  const navigateToLang = i18n.language === "nn" ? "nb" : "nn";

  return (
    <Button {...props} asChild consumeCss variant="tertiary" data-testid="language-selector" type={undefined}>
      <a href={constructNewPath(href, navigateToLang)}>
        {t(`languages.${navigateToLang}`)} <GlobalLine />
      </a>
    </Button>
  );
};
