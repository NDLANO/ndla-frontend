/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Additional, PresentationLine } from "@ndla/icons/common";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NavigationSafeLinkButton, NavigationSafeLinkButtonVariantProps } from "./NavigationSafeLinkButton";

const StyledWrapper = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    display: "inline-flex",
    gap: "xsmall",
    flexWrap: "wrap",
    mobileWideDown: {
      display: "flex",
      flexDirection: "column",
    },
  },
});

interface ItemProps {
  url?: string;
  label: string;
  id?: string;
  current?: "page" | boolean;
  isAdditionalResource?: boolean;
  isRestrictedResource?: boolean;
}

interface Props {
  heading?: string;
  items?: ItemProps[];
}

export const NavigationBox = ({ heading, variant, items }: Props & NavigationSafeLinkButtonVariantProps) => {
  const { t } = useTranslation();
  const headingId = useId();
  return (
    <StyledWrapper aria-labelledby={headingId}>
      {heading && (
        <Heading id={headingId} asChild consumeCss textStyle="label.large" fontWeight="bold">
          <h2>{heading}</h2>
        </Heading>
      )}
      <StyledList data-testid="nav-box-list">
        {items?.map((item) => (
          <li key={item.label} data-testid="nav-box-item">
            <NavigationSafeLinkButton to={item.url ?? ""} aria-current={item.current} variant={variant}>
              {item.isAdditionalResource && (
                <Additional
                  aria-label={t("resource.additionalTooltip")}
                  title={t("resource.additionalTooltip")}
                  aria-hidden={false}
                />
              )}
              {/* TODO: Consider adding a label to this */}
              {item.isRestrictedResource && <PresentationLine />}
              {item.label}
            </NavigationSafeLinkButton>
          </li>
        ))}
      </StyledList>
    </StyledWrapper>
  );
};

export default NavigationBox;
