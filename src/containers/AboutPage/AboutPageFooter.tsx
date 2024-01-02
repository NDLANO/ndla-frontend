/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { Forward } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { Heading } from '@ndla/typography';
import { FRONTPAGE_ARTICLE_MAX_WIDTH } from '@ndla/ui';
import { findBreadcrumb } from './AboutPageContent';
import { GQLAboutPageFooter_FrontpageMenuFragment } from '../../graphqlTypes';
import { toAbout } from '../../routeHelpers';

interface Props {
  frontpage: GQLAboutPageFooter_FrontpageMenuFragment;
}

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
  list-style: none;
  gap: ${spacing.small};
  li {
    margin: 0px;
  }
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: 100%;
  padding: ${spacing.normal} ${spacing.medium};
  justify-content: space-between;
  border-color: ${colors.brand.tertiary};
  border-width: 1px;
  background-color: ${colors.background.lightBlue};
  &[data-current='true'] {
    background-color: ${colors.brand.primary};
    color: ${colors.white};
    svg {
      color: ${colors.white};
    }
  }
`;

const StyledSubSafeLinkButton = styled(SafeLinkButton)`
  width: 100%;
  padding-left: ${spacing.medium};
  padding-right: ${spacing.medium};
  justify-content: space-between;
  &[aria-current='page'] {
    &:not(:hover, :focus, :focus-visible) {
      background-color: ${colors.brand.primary};
      color: ${colors.white};
      svg {
        color: ${colors.white};
      }
    }
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${FRONTPAGE_ARTICLE_MAX_WIDTH};
  ${mq.range({ until: breakpoints.tabletWide })} {
    padding: ${spacing.normal};
  }
  h2 {
    align-self: flex-start;
  }
`;

const StyledNav = styled.nav`
  width: 100%;
`;

const AboutPageFooter = ({ frontpage }: Props) => {
  const { slug } = useParams();

  const crumb = useMemo(() => findBreadcrumb(frontpage.menu ?? [], slug), [frontpage.menu, slug]);

  const [title, menu] = useMemo(() => {
    if (frontpage.article.slug === slug) {
      return [frontpage.article.title, frontpage.menu];
    }
    const item = crumb[crumb.length - 1];
    // If the current page does not have a menu, use the parent menu.
    const menu = item?.menu ?? crumb[crumb.length - 2]?.menu ?? [];
    // If the current page does not have a menu, use the parent title.
    return [item?.menu ? item.article.title : crumb[crumb.length - 2]?.article.title, menu];
  }, [crumb, frontpage, slug]);

  const isRoot = useMemo(() => crumb.length === 1, [crumb]);

  if (!title || !slug || !menu?.length) return null;

  return (
    <FooterWrapper>
      <Heading element="h2" id="aboutNavTitle" headingStyle="list-title">
        {title}
      </Heading>
      <StyledNav aria-labelledby="aboutNavTitle">
        <StyledList>
          {menu?.map((menuItem) => (
            <li key={menuItem.article.slug}>
              {isRoot ? (
                <StyledSafeLinkButton
                  to={toAbout(menuItem.article.slug)}
                  variant="ghost"
                  colorTheme="light"
                  shape="sharp"
                  aria-current={menuItem.article.slug === slug ? 'page' : false}
                >
                  {menuItem.article.title}
                  <Forward />
                </StyledSafeLinkButton>
              ) : (
                <StyledSubSafeLinkButton
                  to={toAbout(menuItem.article.slug)}
                  variant="ghost"
                  colorTheme="light"
                  aria-current={menuItem.article.slug === slug ? 'page' : false}
                >
                  {menuItem.article.title}
                </StyledSubSafeLinkButton>
              )}
            </li>
          ))}
        </StyledList>
      </StyledNav>
    </FooterWrapper>
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
        }
      }
    }
    ${frontpageMenuFragment}
  `,
};

export default AboutPageFooter;
