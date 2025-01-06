/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine, SearchLine } from "@ndla/icons";
import { FieldInput, FieldLabel, FieldRoot, Heading, IconButton, InputContainer } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb } from "@ndla/ui";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { useLtiContext } from "../../LtiContext";
import { SubjectFilter } from "./SubjectFilter";
import { TraitFilter } from "./TraitFilter";

const StyledMain = styled("main", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
  },
});

const SearchFieldWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    width: "100%",
  },
});

const FiltersWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

export const SearchContainer = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isLti = useLtiContext();
  const { t } = useTranslation();

  return (
    <StyledMain>
      {!isLti && (
        <HomeBreadcrumb
          items={[
            { name: t("breadcrumb.toFrontpage"), to: "/" },
            { to: "/search", name: t("searchPage.search") },
          ]}
        />
      )}
      {!isLti && (
        <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
          {t("searchPage.title")}
        </Heading>
      )}
      <form action="/search/">
        <SearchFieldWrapper>
          <StyledFieldRoot>
            <FieldLabel srOnly>{t("searchPage.title")}</FieldLabel>
            <InputContainer>
              <FieldInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                ref={inputRef}
                placeholder={t("searchPage.searchFieldPlaceholder")}
                type="search"
                autoComplete="off"
                name="search"
              />
              {!!query && (
                <IconButton
                  variant="clear"
                  aria-label={t("welcomePage.resetSearch")}
                  title={t("welcomePage.resetSearch")}
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  <CloseLine />
                </IconButton>
              )}
            </InputContainer>
          </StyledFieldRoot>
          <IconButton type="submit" aria-label={t("searchPage.search")} title={t("searchPage.search")}>
            <SearchLine />
          </IconButton>
        </SearchFieldWrapper>
      </form>
      <FiltersWrapper>
        <Heading textStyle="title.medium" asChild consumeCss>
          {/* TODO: i18n */}
          <h2>Tilpass søket ditt</h2>
        </Heading>
        <TraitFilter />
        <SubjectFilter />
      </FiltersWrapper>
    </StyledMain>
  );
};
