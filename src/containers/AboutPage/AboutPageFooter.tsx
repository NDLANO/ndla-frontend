/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { Forward } from '@ndla/icons/common';
import { FRONTPAGE_ARTICLE_MAX_WIDTH, Heading } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react';
import { GQLAboutPageFooter_FrontpageMenuFragment } from '../../graphqlTypes';

interface Props {
  frontpage: GQLAboutPageFooter_FrontpageMenuFragment;
}

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
  /* gap: ${spacing.small}; */
  list-style: none;
  li {
    margin: 0px;
  }
  &:not([data-level='0']) {
    margin-left: ${spacing.small};
  }
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: 100%;
  padding: ${spacing.normal} ${spacing.medium};
  justify-content: space-between;
  border-color: ${colors.brand.tertiary};
  border-width: 1px;
  background-color: ${colors.background.lightBlue};
`;

const StyledSubSafeLinkButton = styled(SafeLinkButton)`
  width: 100%;
  padding-left: ${spacing.medium};
  padding-right: ${spacing.medium};
  justify-content: space-between;
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
  const { t } = useTranslation();
  if (!frontpage.menu.length) return null;

  return (
    <FooterWrapper>
      <Heading element="h2" id="aboutNavTitle" headingStyle="list-title">
        {t('about.menuTitle')}
      </Heading>
      <StyledNav aria-labelledby="aboutNavTitle">
        <MenuList
          items={frontpage.menu as GQLAboutPageFooter_FrontpageMenuFragment[]}
          level={0}
        />
      </StyledNav>
    </FooterWrapper>
  );
};

interface MenuListProps {
  items: GQLAboutPageFooter_FrontpageMenuFragment[];
  level: number;
}

const MenuList = ({ items, level }: MenuListProps) => {
  return (
    <StyledList data-level={level}>
      {items.map((item) => (
        <Fragment key={item.article.slug}>
          <li>
            {level ? (
              <StyledSubSafeLinkButton
                to={`/about/${item.article.slug}`}
                variant="ghost"
                colorTheme="light"
              >
                {item.article.title}
              </StyledSubSafeLinkButton>
            ) : (
              <StyledSafeLinkButton
                to={`/about/${item.article.slug}`}
                variant="solid"
                colorTheme="greyLighter"
                shape="sharp"
              >
                {item.article.title}
                <Forward />
              </StyledSafeLinkButton>
            )}
          </li>
          {!!item.menu?.length && (
            <MenuList
              items={item.menu as GQLAboutPageFooter_FrontpageMenuFragment[]}
              level={level + 1}
            />
          )}
        </Fragment>
      ))}
    </StyledList>
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
