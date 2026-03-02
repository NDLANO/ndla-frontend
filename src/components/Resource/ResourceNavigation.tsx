/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowLeftLine, ArrowRightLine } from "@ndla/icons";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props<T> {
  parentUrl: string | undefined;
  items: T[];
  getUrl: (item: T | undefined) => string | undefined;
  getId: (item: T) => string | number | undefined;
  currentId: string | number | undefined;
}

const ButtonsContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    _print: {
      display: "none",
    },
  },
});

export const ResourceNavigation = <T,>({ parentUrl, items, getUrl, getId, currentId }: Props<T>) => {
  const { t } = useTranslation();

  const urls = useMemo(() => {
    if (items.length) {
      const currentIndex = items.findIndex((item) => getId(item) === currentId);
      if (currentIndex != null) {
        return {
          current: getUrl(items[currentIndex]),
          previous: getUrl(items[currentIndex - 1]),
          next: getUrl(items[currentIndex + 1]),
        };
      }
    }
    return { previous: undefined, next: undefined, current: undefined };
  }, [currentId, getId, getUrl, items]);

  if (!items.length || !urls.current) return null;

  const nextUrl = urls.next ?? parentUrl;

  return (
    <ButtonsContainer>
      <SafeLinkButton variant="secondary" disabled={!urls.previous?.length} to={urls.previous ?? ""}>
        <ArrowLeftLine />
        {t("resourcePage.previous")}
      </SafeLinkButton>
      <SafeLinkButton to={nextUrl ?? ""} disabled={!nextUrl?.length}>
        {!urls.next && parentUrl ? (
          t("resourcePage.backToTopic")
        ) : (
          <>
            {t("resourcePage.next")}
            <ArrowRightLine />
          </>
        )}
      </SafeLinkButton>
    </ButtonsContainer>
  );
};
