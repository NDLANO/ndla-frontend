/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import {
  FRONTPAGE_ARTICLE_MAX_WIDTH,
  FeideUserApiType,
  FrontpageArticle,
  HomeBreadcrumb,
} from '@ndla/ui';
import { DynamicComponents } from '@ndla/article-converter';
import { useEffect, useMemo } from 'react';
import { CustomWithTranslation, withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing, spacingUnit } from '@ndla/core';
import { TFunction } from 'i18next';
import { withTracker } from '@ndla/tracker';
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
import getStructuredDataFromArticle, {
  structuredArticleDataFragment,
} from '../../util/getStructuredDataFromArticle';
import { getAllDimensions } from '../../util/trackingUtil';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { toAbout } from '../../routeHelpers';

interface Props extends CustomWithTranslation {
  article: GQLAboutPage_ArticleFragment;
  frontpage: GQLAboutPage_FrontpageMenuFragment;
  user: FeideUserApiType | undefined;
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
  ${mq.range({ until: breakpoints.tabletWide })} {
    padding: ${spacing.normal};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const findBreadcrumb = (
  menu: GQLAboutPage_FrontpageMenuFragment[],
  slug: string | undefined,
  currentPath: GQLAboutPage_FrontpageMenuFragment[] = [],
): GQLAboutPage_FrontpageMenuFragment[] => {
  for (const item of menu) {
    const newPath = currentPath.concat(item);
    if (item.article.slug === slug) {
      return newPath;
    } else if (item.menu?.length) {
      const foundPath = findBreadcrumb(
        item.menu as GQLAboutPage_FrontpageMenuFragment[],
        slug,
        newPath,
      );
      if (foundPath.length) {
        return foundPath;
      }
    }
  }
  return [];
};

const getBreadcrumb = (
  slug: string | undefined,
  frontpage: GQLAboutPage_FrontpageMenuFragment,
  t: TFunction,
) => {
  const crumbs = findBreadcrumb(
    frontpage.menu as GQLAboutPage_FrontpageMenuFragment[],
    slug,
  );
  return [
    {
      name: t('breadcrumb.toFrontpage'),
      to: '/',
    },
  ].concat(
    crumbs.map((crumb) => ({
      name: crumb.article.title,
      to: toAbout(crumb.article.slug),
    })),
  );
};

const getDocumentTitle = (
  t: TFunction,
  article: GQLAboutPage_ArticleFragment,
) => t('htmlTitles.aboutPage', { name: article.title });

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

const AboutPageContent = ({ article: _article, frontpage, t, i18n }: Props) => {
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${_article.id}`;
  const crumbs = useMemo(
    () => getBreadcrumb(_article.slug, frontpage, t),
    [_article.slug, frontpage, t],
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

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === 'function') {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  return (
    <Wrapper>
      <StyledMain>
        <Helmet>
          <title>{`${getDocumentTitle(t, article)}`}</title>
          <meta name="pageid" content={`${article.id}`} />
          {scripts?.map((script) => (
            <script
              key={script.src}
              src={script.src}
              type={script.type}
              async={script.async}
              defer={script.defer}
            />
          ))}
          <link
            rel="alternate"
            type="application/json+oembed"
            href={oembedUrl}
            title={article.title}
          />
          <script type="application/ld+json">
            {JSON.stringify(
              getStructuredDataFromArticle(_article, i18n.language, crumbs),
            )}
          </script>
        </Helmet>
        <SocialMediaMetadata
          title={article.title}
          description={article.metaDescription}
          imageUrl={article.metaImage?.url}
          trackableContent={article}
        />
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

AboutPageContent.getDimensions = (props: Props) => {
  const { user, article } = props;

  return getAllDimensions({ article, user }, undefined, true);
};

AboutPageContent.willTrackPageView = (
  trackPageView: (props: Props) => void,
  props: Props,
) => {
  if (props.article) {
    trackPageView(props);
  }
};

export const aboutPageFragments = {
  article: gql`
    fragment AboutPage_Article on Article {
      id
      content
      introduction
      created
      updated
      slug
      published
      metaData {
        copyText
      }
      ...LicenseBox_Article
      ...StructuredArticleData
    }
    ${LicenseBox.fragments.article}
    ${structuredArticleDataFragment}
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

AboutPageContent.getDocumentTitle = ({ t, article }: Props) =>
  getDocumentTitle(t, article);

export default withTranslation()(withTracker(AboutPageContent));
