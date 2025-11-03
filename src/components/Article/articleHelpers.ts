/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router";
import { webpageReferenceApa7CopyString } from "@ndla/licenses";
import config from "../../config";
import { MastheadHeightPx } from "../../constants";
import { GQLArticle } from "../../graphqlTypes";
import { useIsMastheadSticky } from "../../util/useIsMastheadSticky";

export const useArticleCopyText = (
  article: Pick<GQLArticle, "id" | "title" | "published" | "copyright"> | undefined,
) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const href = useHref(location);
  if (!article) return undefined;
  const [day, month, year] = article.published.split(".").map((s) => parseInt(s));
  const published = new Date(year!, month! - 1, day!).toUTCString();
  return webpageReferenceApa7CopyString(
    article.title,
    undefined,
    published,
    `${config.ndlaFrontendDomain}${href}`,
    article.copyright,
    i18n.language,
    "",
    (id: string) => t(id),
  );
};

const getMastheadHeightFromCssVariable = () => {
  const cssVarValue = document.documentElement.style.getPropertyValue("--masthead-height");
  const maybeNumber = Number(cssVarValue.replace("px", ""));
  return isNaN(maybeNumber) ? MastheadHeightPx : maybeNumber;
};

// Scroll to element with ID passed in as a query-parameter.
// We use query-params instead of the regular fragments since
// the article doesn't exist on initial page load (At least without SSR).
export const useNavigateToHash = (articleContent: ReactNode | undefined) => {
  const { hash } = useLocation();
  const isMastheadSticky = useIsMastheadSticky();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const mastheadHeight = getMastheadHeightFromCssVariable();
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition = isMastheadSticky ? absoluteTop - mastheadHeight - 20 : absoluteTop - 20;

        element?.focus();
        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 400);
    }
  }, [articleContent, hash]);
};
