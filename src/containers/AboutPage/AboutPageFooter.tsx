/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { findBreadcrumb } from "./AboutPageContent";
import { NavigationSafeLinkButton } from "../../components/NavigationSafeLinkButton";
import { GQLAboutPageFooter_FrontpageMenuFragment } from "../../graphqlTypes";
import { toAbout } from "../../routeHelpers";

interface Props {
  frontpage: GQLAboutPageFooter_FrontpageMenuFragment;
}

const StyledList = styled("ul", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

const StyledOuterListItem = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledListItem = styled("li", {
  base: {
    flexGrow: "1",
  },
});

const StyledOuterList = styled("ul", {
  base: {
    paddingBlockStart: "xxlarge",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const StyledNav = styled("nav", {
  base: {
    position: "relative",
    backgroundColor: "surface.brand.3.subtle",
    zIndex: "base",
    _after: {
      content: '""',
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "-100vw",
      right: "-100vw",
      zIndex: "hide",
      background: "inherit",
    },
  },
});

const AboutPageFooter = ({ frontpage }: Props) => {
  const { slug } = useParams();
  const { t } = useTranslation();

  const crumb = useMemo(() => findBreadcrumb(frontpage.menu ?? [], slug), [frontpage.menu, slug]);
  const nonEmptyCrumbs = crumb.filter((item) => !!item.menu?.length);

  return (
    <StyledNav aria-label={t("aboutPage.nav")}>
      <StyledOuterList>
        {nonEmptyCrumbs.map((item, index) => (
          <StyledOuterListItem key={item.article.slug}>
            <Heading id={`${item.article.slug}-title`} asChild consumeCss textStyle="title.large">
              <h2>{item.article.title}</h2>
            </Heading>
            <StyledList aria-labelledby={`${item.article.slug}-title`}>
              {item.menu?.map((m) => (
                <StyledListItem key={m.article.slug}>
                  <NavigationSafeLinkButton
                    to={toAbout(m.article.slug)}
                    variant={index === 0 ? "primary" : "secondary"}
                    data-variant={index === 0 ? "primary" : "secondary"}
                    aria-current={
                      crumb[crumb.length - 1]?.article.slug === m.article.slug
                        ? "page"
                        : crumb.some((c) => c.article.slug === m.article.slug)
                    }
                  >
                    {m.article.title}
                  </NavigationSafeLinkButton>
                </StyledListItem>
              ))}
            </StyledList>
          </StyledOuterListItem>
        ))}
      </StyledOuterList>
    </StyledNav>
  );
};

export const frontpageMenuFragment = gql`
  fragment FrontpageMenuFragment on FrontpageMenu {
    articleId
    article {
      title
      slug
    }
  }
`;

AboutPageFooter.fragments = {
  frontpageMenu: gql`
    fragment AboutPageFooter_FrontpageMenu on FrontpageMenu {
      ...FrontpageMenuFragment
      menu {
        ...FrontpageMenuFragment
        menu {
          ...FrontpageMenuFragment
          menu {
            ...FrontpageMenuFragment
          }
        }
      }
    }
    ${frontpageMenuFragment}
  `,
};

export default AboutPageFooter;
