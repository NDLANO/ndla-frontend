/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowRightShortLine } from "@ndla/icons";
import { Skeleton, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "../../interfaces";

const CrumbContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    backgroundColor: "background.default",
    boxShadow: "xsmall",
    padding: "medium",
    desktopDown: {
      borderRadius: "xsmall",
    },
  },
});

const StyledOl = styled("ol", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
  },
});

const StyledLi = styled("li", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
  variants: {
    isFirst: {
      true: {
        width: "100%",
        "& a": {
          color: "text.strong",
          textStyle: "title.small",
        },
      },
      false: {
        "& a, & span": {
          color: "text.subtle",
        },
      },
    },
  },
});

interface Props {
  breadcrumbs: Breadcrumb[];
  loading: boolean;
}

export const ResourceBreadcrumb = ({ breadcrumbs, loading }: Props) => {
  const { t } = useTranslation();

  return (
    <CrumbContainer>
      <Text textStyle="label.xsmall" color="text.subtle">
        {t("common.subject", { count: 1 })}
      </Text>
      {loading ? (
        <>
          <Skeleton css={{ width: "20%", height: "large" }} />
          <Skeleton css={{ width: "100%", height: "medium" }} />
        </>
      ) : (
        <nav aria-label={t("breadcrumb.breadcrumb")}>
          <StyledOl>
            {breadcrumbs.map((item, index) => (
              <StyledLi key={index} isFirst={index === 0}>
                {index === breadcrumbs.length - 1 ? (
                  <span>{item.name}</span>
                ) : (
                  <SafeLink to={item.url ?? ""}>{item.name}</SafeLink>
                )}
                {index !== breadcrumbs.length - 1 && index !== 0 && <ArrowRightShortLine />}
              </StyledLi>
            ))}
          </StyledOl>
        </nav>
      )}
    </CrumbContainer>
  );
};
