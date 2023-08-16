/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import { Forward } from '@ndla/icons/common';
import { FRONTPAGE_ARTICLE_MAX_WIDTH, Heading } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { GQLAboutPageFooter_FrontpageMenuFragment } from '../../graphqlTypes';

interface Props {
  frontpage: GQLAboutPageFooter_FrontpageMenuFragment;
}

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0px;
  padding: 0px;
  gap: ${spacing.small};
  list-style: none;
`;

const StyledSafeLinkButton = styled(SafeLinkButton)`
  width: 100%;
  padding: ${spacing.normal} ${spacing.medium};
  justify-content: space-between;
  border-color: ${colors.brand.tertiary};
  border-width: 1px;
  background-color: ${colors.background.lightBlue};
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${FRONTPAGE_ARTICLE_MAX_WIDTH};
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
        <StyledList>
          {frontpage.menu.map((item) => (
            <>
              <li key={item.article.slug}>
                <StyledSafeLinkButton
                  to={`/about/${item.article.slug}`}
                  variant="solid"
                  colorTheme="greyLighter"
                  shape="sharp"
                >
                  {item.article.title}
                  <Forward />
                </StyledSafeLinkButton>
              </li>
              {!!item.menu.length && (
                <StyledList>
                  {item.menu.map((subItem) => (
                    <li key={subItem.article.slug}>
                      <StyledSafeLinkButton
                        to={`/about/${subItem.article.slug}`}
                        variant="solid"
                        colorTheme="greyLighter"
                        shape="sharp"
                      >
                        {subItem.article.title}
                      </StyledSafeLinkButton>
                    </li>
                  ))}
                </StyledList>
              )}
            </>
          ))}
        </StyledList>
      </StyledNav>
    </FooterWrapper>
  );
};

AboutPageFooter.fragments = {
  frontpageMenu: gql`
    fragment AboutPageFooter_FrontpageMenu on FrontpageMenu {
      article {
        title
        slug
      }
      menu {
        article {
          title
          slug
        }
        menu {
          article {
            title
            slug
          }
        }
      }
    }
  `,
};

export default AboutPageFooter;
