/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GlobalLine } from "@ndla/icons";
import { Button, ButtonProps } from "@ndla/primitives";
import { useMemo, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router";
import { constructNewPath } from "../../util/urlHelper";

export const LanguageSelector = ({ variant = "tertiary", ...props }: ButtonProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const serverSnapshot = useMemo(() => ({ ...location, hash: "" }), [location]);
  const ssrFriendlyLocation = useSyncExternalStore(
    () => () => {},
    () => location,
    () => serverSnapshot,
  );
  const href = useHref(ssrFriendlyLocation);

  const navigateToLang = i18n.language !== "nb" ? "nb" : "nn";

  return (
    <Button {...props} variant={variant} asChild consumeCss data-testid="language-selector" type={undefined}>
      <a href={constructNewPath(href, navigateToLang)}>
        <GlobalLine /> {t(`languages.${i18n.language}`)}
      </a>
    </Button>
  );
};
