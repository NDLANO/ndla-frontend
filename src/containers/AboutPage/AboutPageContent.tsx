/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import { FrontpageArticle } from '@ndla/ui';
import { DynamicComponents } from '@ndla/article-converter';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import styled from '@emotion/styled';
import { colors, spacingUnit } from '@ndla/core';
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
  border-bottom: 1px solid ${colors.brand.light};
  section {
    padding: 0px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const converterComponents: DynamicComponents | undefined =
  config.favoriteEmbedEnabled ? { heartButton: AddEmbedToFolder } : undefined;

const AboutPageContent = ({ article: _article, frontpage }: Props) => {
  const { i18n } = useTranslation();
  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(_article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${_article.id}`,
        components: converterComponents,
      }),
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
        footnotes {
          ref
          title
          year
          authors
          edition
          publisher
          url
        }
      }
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
  frontpageMenu: gql`
    fragment AboutPage_FrontpageMenu on FrontpageMenu {
      menu {
        ...AboutPageFooter_FrontpageMenu
      }
    }
    ${AboutPageFooter.fragments.frontpageMenu}
  `,
};

export default AboutPageContent;
