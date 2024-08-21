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
import { ArticlePadding, OneColumn } from "@ndla/ui";
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
    paddingBlockEnd: "4xlarge",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const Wrapper = styled("div", {
  base: {
    backgroundColor: "surface.brand.3.subtle",
  },
});

const AboutPageFooter = ({ frontpage }: Props) => {
  const { slug } = useParams();
  const { t } = useTranslation();

  const crumb = useMemo(() => findBreadcrumb(frontpage.menu ?? [], slug), [frontpage.menu, slug]);

  return (
    <Wrapper>
      <OneColumn>
        <ArticlePadding asChild consumeCss>
          <nav aria-label={t("aboutPage.nav")}>
            <StyledOuterList>
              {crumb
                .filter((item) => !!item.menu?.length)
                .map((item, index) => (
                  <StyledOuterListItem key={item.article.slug}>
                    <Heading id={`${item.article.slug}-title`} asChild consumeCss textStyle="title.large">
                      <h2>{item.article.title}</h2>
                    </Heading>
                    <StyledList aria-labelledby={`${item.article.slug}-title`}>
                      {item.menu?.map((m) => {
                        return (
                          <StyledListItem key={m.article.slug}>
                            <NavigationSafeLinkButton
                              to={toAbout(m.article.slug)}
                              variant={index === 0 ? "primary" : "secondary"}
                              data-variant={index === 0 ? "primary" : "secondary"}
                              aria-selected={crumb.some((c) => c.article.slug === m.article.slug)}
                              aria-current={
                                crumb[crumb.length - 1]?.article.slug === m.article.slug ? "page" : undefined
                              }
                            >
                              {m.article.title}
                            </NavigationSafeLinkButton>
                          </StyledListItem>
                        );
                      })}
                    </StyledList>
                  </StyledOuterListItem>
                ))}
            </StyledOuterList>
          </nav>
        </ArticlePadding>
      </OneColumn>
    </Wrapper>
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
