/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import {
  FRONTPAGE_ARTICLE_MAX_WIDTH,
  FrontpageArticle,
  HomeBreadcrumb,
  SimpleBreadcrumbItem,
} from '@ndla/ui';
import { DynamicComponents } from '@ndla/article-converter';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';
import { colors, spacing, spacingUnit } from '@ndla/core';
import { TFunction } from 'i18next';
import LicenseBox from '../../components/license/LicenseBox';
import {
  GQLAboutPage_ArticleFragment,
  GQLAboutPage_FrontpageMenuFragment,
} from '../../graphqlTypes';
import { transformArticle } from '../../util/transformArticle';
import config from '../../config';
import { getArticleScripts } from '../../util/getArticleScripts';
import { SKIP_TO_CONTENT_ID } from '../../constants';
import AddEmbedToFolder from '../../components/MyNdla/AddEmbedToFolder';
import AboutPageFooter from './AboutPageFooter';

interface Props {
  article: GQLAboutPage_ArticleFragment;
  frontpage: GQLAboutPage_FrontpageMenuFragment;
}

const StyledMain = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.background.lightBlue};
  padding-bottom: ${spacingUnit * 4}px;
  padding-top: ${spacing.normal};
  border-bottom: 1px solid ${colors.brand.light};
  section {
    padding: 0px;
  }
  nav {
    max-width: ${FRONTPAGE_ARTICLE_MAX_WIDTH};
    width: 100%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const findBreadcrumb = (
  menu: GQLAboutPage_FrontpageMenuFragment[],
  articleId: number,
  currentPath: GQLAboutPage_FrontpageMenuFragment[] = [],
): GQLAboutPage_FrontpageMenuFragment[] => {
  for (const item of menu) {
    const newPath = currentPath.concat(item);
    if (item.articleId === articleId) {
      return newPath;
    } else if (item.menu.length) {
      const foundPath = findBreadcrumb(
        item.menu as GQLAboutPage_FrontpageMenuFragment[],
        articleId,
        newPath,
      );
      if (foundPath) {
        return foundPath;
      }
    }
  }
  return [];
};

const getBreadcrumb = (
  articleId: number,
  frontpage: GQLAboutPage_FrontpageMenuFragment,
  t: TFunction,
): SimpleBreadcrumbItem[] => {
  const crumbs = findBreadcrumb(
    frontpage.menu as GQLAboutPage_FrontpageMenuFragment[],
    articleId,
  );
  return [
    {
      name: t('breadcrumb.toFrontpage'),
      to: '/',
    },
  ].concat(
    crumbs.map((crumb) => ({
      name: crumb.article.title,
      to: `/about/${crumb.article.slug}`,
    })),
  );
};

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

const AboutPageContent = ({ article: _article, frontpage }: Props) => {
  const { t, i18n } = useTranslation();
  const crumbs = useMemo(
    () => getBreadcrumb(_article.id, frontpage, t),
    [_article.id, frontpage, t],
  );

  const [article, scripts] = useMemo(() => {
    const transformedArticle = transformArticle(_article, i18n.language, {
      path: `${config.ndlaFrontendDomain}/article/${_article.id}`,
      components: converterComponents,
    });
    return [
      {
        ...transformedArticle,
        introduction: transformedArticle.introduction ?? '',
      },
      getArticleScripts(_article, i18n.language),
    ];
  }, [_article, i18n.language])!;

  return (
    <Wrapper>
      <StyledMain>
        <Helmet>
          {scripts?.map((script) => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
              defer={script.defer}
            />
          ))}
        </Helmet>
        <HomeBreadcrumb items={crumbs} />
        <FrontpageArticle
          id={SKIP_TO_CONTENT_ID}
          article={article}
          licenseBox={
            <LicenseBox
              article={article}
              copyText={article?.metaData?.copyText}
            />
          }
        />
      </StyledMain>
      <AboutPageFooter frontpage={frontpage} />
    </Wrapper>
  );
};

export const aboutPageFragments = {
  article: gql`
    fragment AboutPage_Article on Article {
      id
      content
      introduction
      created
      updated
      published
      metaData {
        copyText
      }
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
  frontpageMenu: gql`
    fragment AboutPage_FrontpageMenu on FrontpageMenu {
      ...FrontpageMenuFragment
      menu {
        ...AboutPageFooter_FrontpageMenu
      }
    }
    ${AboutPageFooter.fragments.frontpageMenu}
  `,
};

export default AboutPageContent;
