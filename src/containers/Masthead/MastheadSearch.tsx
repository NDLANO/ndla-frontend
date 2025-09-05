/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo, useRef, CSSProperties, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useComponentSize } from "@ndla/hooks";
import { SearchLine } from "@ndla/icons";
import { Button, PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MastheadPopoverBackdrop, MastheadPopoverContent } from "./MastheadPopover";
import { mastheadSearchInputId } from "./mastheadUtils";

const MastheadSearchForm = lazy(() => import("./components/MastheadSearchForm"));

const StyledButton = styled(Button, {
  base: {
    tabletDown: {
      paddingInline: "xsmall",
      "& span": {
        display: "none",
      },
    },
  },
});

const MastheadSearch = () => {
  const [dialogState, setDialogState] = useState({ open: false });
  const { t } = useTranslation();
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const { height } = useComponentSize("masthead");

  const style = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);

  useEffect(() => {
    const onSlashPressed = (evt: KeyboardEvent) => {
      if (
        evt.key === "/" &&
        !["input", "textarea"].includes(document.activeElement?.tagName?.toLowerCase() ?? "") &&
        document.activeElement?.attributes.getNamedItem("contenteditable")?.value !== "true" &&
        !dialogState.open
      ) {
        evt.preventDefault();
        setDialogState({ open: true });
      }
    };
    window.addEventListener("keydown", onSlashPressed);
    return () => window.removeEventListener("keydown", onSlashPressed);
  }, [dialogState.open]);

  return (
    <PopoverRoot
      open={dialogState.open}
      onOpenChange={setDialogState}
      initialFocusEl={() => document.getElementById(mastheadSearchInputId)}
    >
      <PopoverTrigger asChild ref={dialogTriggerRef}>
        <StyledButton variant="tertiary" aria-label={t("masthead.menu.search")} title={t("masthead.menu.search")}>
          <SearchLine />
          <span>{t("masthead.menu.search")}</span>
        </StyledButton>
      </PopoverTrigger>
      <MastheadPopoverContent aria-label={t("searchPage.searchFieldPlaceholder")} style={style}>
        <Suspense>
          <MastheadSearchForm onClose={() => setDialogState({ open: false })} />
        </Suspense>
      </MastheadPopoverContent>
      <MastheadPopoverBackdrop present={dialogState.open} style={style} />
    </PopoverRoot>
  );
};

export default MastheadSearch;
