/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Fragment, useMemo } from "react";
import { useParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { Heading } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ArticlePadding, OneColumn } from "@ndla/ui";
import { findBreadcrumb } from "./AboutPageContent";
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

// TODO: Fix handling of active safeLinkButton when implemented
const StyledSafeLinkButtonPrimary = styled(SafeLinkButton, {
  base: { width: "100%", justifyContent: "start" },
  variants: {
    active: {
      true: {
        backgroundColor: "surface.action.active",
      },
    },
  },
});
// TODO: Fix handling of active safeLinkButton when implemented
const StyledSafeLinkButtonSecondary = styled(SafeLinkButton, {
  base: { width: "100%", justifyContent: "start" },
  variants: {
    active: {
      true: {
        backgroundColor: "surface.actionSubtle.active",
      },
    },
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

  const crumb = useMemo(() => findBreadcrumb(frontpage.menu ?? [], slug), [frontpage.menu, slug]);

  return (
    <Wrapper>
      <OneColumn>
        <ArticlePadding asChild>
          <StyledOuterList>
            {crumb.map((item, index) => (
              <Fragment key={item.article.slug}>
                {!!item.menu?.length && (
                  <StyledOuterListItem>
                    <Heading id={`${item.article.slug}-title`} asChild consumeCss textStyle="title.large">
                      <h2>{item.article.title}</h2>
                    </Heading>
                    <nav aria-labelledby={`${item.article.slug}-title`}>
                      <StyledList>
                        {item.menu.map((m) => {
                          const current = crumb.some((c) => c.article.slug === m.article.slug);
                          return (
                            <StyledListItem key={m.article.slug}>
                              {index === 0 ? (
                                <StyledSafeLinkButtonPrimary
                                  to={toAbout(m.article.slug)}
                                  aria-current={current}
                                  active={current}
                                  variant="primary"
                                >
                                  {m.article.title}
                                </StyledSafeLinkButtonPrimary>
                              ) : (
                                <StyledSafeLinkButtonSecondary
                                  to={toAbout(m.article.slug)}
                                  aria-current={current}
                                  active={current}
                                  variant="secondary"
                                >
                                  {m.article.title}
                                </StyledSafeLinkButtonSecondary>
                              )}
                            </StyledListItem>
                          );
                        })}
                      </StyledList>
                    </nav>
                  </StyledOuterListItem>
                )}
              </Fragment>
            ))}
          </StyledOuterList>
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
