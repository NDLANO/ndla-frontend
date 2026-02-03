/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { SearchLine } from "@ndla/icons";
import { Button, PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useState, useEffect, useMemo, Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { GQLCurrentContextQuery, GQLCurrentContextQueryVariables } from "../../graphqlTypes";
import { isValidContextId } from "../../util/urlHelper";
import { MastheadPopoverBackdrop, MastheadPopoverContent } from "./MastheadPopover";

const MastheadSearchForm = lazy(() => import("./MastheadSearchForm"));

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

const currentContextQueryDef = gql`
  query currentContext($contextId: String!) {
    root: node(contextId: $contextId) {
      id
      nodeType
      name
      context {
        contextId
        rootId
        root
      }
    }
  }
`;

export const MastheadSearch = () => {
  const [dialogState, setDialogState] = useState({ open: false });
  const { t } = useTranslation();
  const { contextId } = useParams();

  const currentContextQuery = useQuery<GQLCurrentContextQuery, GQLCurrentContextQueryVariables>(
    currentContextQueryDef,
    {
      variables: {
        contextId: contextId ?? "",
      },
      skip: !isValidContextId(contextId) || typeof window === "undefined",
    },
  );

  const root = useMemo(() => {
    const root = currentContextQuery.data?.root;
    if (!root) return undefined;
    if (root.nodeType === "SUBJECT") {
      return root;
    }
    if (root.context) {
      return {
        id: root.context?.rootId,
        name: root.context.root,
      };
    }
    return undefined;
  }, [currentContextQuery.data?.root]);

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
      initialFocusEl={() => document.querySelector("input")}
    >
      <PopoverTrigger asChild>
        <StyledButton variant="tertiary" aria-label={t("masthead.menu.search")} title={t("masthead.menu.search")}>
          <SearchLine />
          <span>{t("masthead.menu.search")}</span>
        </StyledButton>
      </PopoverTrigger>
      <MastheadPopoverContent aria-label={t("searchPage.searchFieldPlaceholder")}>
        <Suspense>
          <MastheadSearchForm root={root} />
        </Suspense>
      </MastheadPopoverContent>
      <MastheadPopoverBackdrop present={dialogState.open} />
    </PopoverRoot>
  );
};
