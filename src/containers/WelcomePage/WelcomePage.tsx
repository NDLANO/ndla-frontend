/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useContext, useEffect, useMemo } from 'react';
import { HelmetWithTracker, useTracker } from '@ndla/tracker';
import {
  ProgrammeV2,
  FrontpageArticle,
  WIDE_FRONTPAGE_ARTICLE_MAX_WIDTH,
} from '@ndla/ui';
import {
  breakpoints,
  colors,
  mq,
  spacing,
  spacingUnit,
  utils,
} from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';

import { PROGRAMME_PATH, SKIP_TO_CONTENT_ID } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import { GQLFrontpageDataQuery, GQLProgrammePage } from '../../graphqlTypes';
import Programmes from './Components/Programmes';
import LicenseBox from '../../components/license/LicenseBox';
import { structuredArticleDataFragment } from '../../util/getStructuredDataFromArticle';
import { useGraphQuery } from '../../util/runQueries';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';
import { AuthContext } from '../../components/AuthenticationContext';
import { getAllDimensions } from '../../util/trackingUtil';

const HiddenHeading = styled.h1`
  ${utils.visuallyHidden};
`;

const StyledMain = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: ${spacingUnit * 3}px;
  padding-top: ${spacing.normal};
  background-color: ${colors.background.lightBlue};

  section {
    padding: 0px;
  }
  nav {
    max-width: ${WIDE_FRONTPAGE_ARTICLE_MAX_WIDTH};
    width: 100%;
  }
  ${mq.range({ until: breakpoints.wide })} {
    padding-left: ${spacing.normal};
    padding-right: ${spacing.normal};
  }
  /* This is a SSR-friendly :first-child */
  [data-wide] > section > *:not(:is(*:not(style) ~ *)) {
    margin-top: ${spacingUnit * 4}px;
  }
`;

const ProgrammeWrapper = styled.div`
  max-width: ${WIDE_FRONTPAGE_ARTICLE_MAX_WIDTH};
  width: 100%;
`;

export const programmeFragment = gql`
  fragment ProgrammeFragment on ProgrammePage {
    id
    title {
      title
      language
    }
    desktopImage {
      url
      alt
    }
    mobileImage {
      url
      alt
    }
    url
  }
`;

const frontpageQuery = gql`
  query frontpageData {
    programmes {
      ...ProgrammeFragment
    }
    frontpage {
      articleId
      article {
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
        ...StructuredArticleData
      }
    }
  }
  ${LicenseBox.fragments.article}
  ${structuredArticleDataFragment}
  ${programmeFragment}
`;

const formatProgrammes = (data: GQLProgrammePage[]): ProgrammeV2[] => {
  return data.map((p) => {
    return {
      id: p.id,
      title: p.title,
      wideImage: {
        src: p.desktopImage?.url || '',
        alt: p.desktopImage?.alt || '',
      },
      narrowImage: {
        src: p.mobileImage?.url || '',
        alt: p.mobileImage?.alt || '',
      },
      url: `${PROGRAMME_PATH}${p.url}` || '',
    };
  });
};

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (authContextLoaded) {
      trackPageView({
        title: t('htmlTitles.welcomePage'),
        dimensions: getAllDimensions({ user }),
      });
    }
  }, [authContextLoaded, t, trackPageView, user]);

  const fpQuery = useGraphQuery<GQLFrontpageDataQuery>(frontpageQuery);

  const programmes = useMemo(() => {
    if (fpQuery.data?.programmes) {
      return formatProgrammes(fpQuery.data.programmes);
    }
    return [];
  }, [fpQuery.data?.programmes]);

  const [article] = useMemo(() => {
    const _article = fpQuery.data?.frontpage?.article;
    if (!_article) return [undefined, undefined];
    const transformedArticle = transformArticle(_article, i18n.language, {
      path: `${config.ndlaFrontendDomain}/`,
      frontendDomain: config.ndlaFrontendDomain,
    });
    return [
      {
        ...transformedArticle,
        copyright: {
          ..._article.copyright,
          processed: _article.copyright.processed ?? false,
        },
      },
      getArticleScripts(_article, i18n.language),
    ];
  }, [fpQuery.data?.frontpage?.article, i18n.language])!;

  const googleSearchJSONLd = () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://ndla.no/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://ndla.no/search?query={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
    return JSON.stringify(data);
  };

  return (
    <>
      <HiddenHeading>{t('welcomePage.heading.heading')}</HiddenHeading>
      <HelmetWithTracker title={t('htmlTitles.welcomePage')}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        type="website"
        title={t('welcomePage.heading.heading')}
        description={t('meta.description')}
        imageUrl={`${config.ndlaFrontendDomain}/static/logo.png`}
      >
        <meta name="keywords" content={t('meta.keywords')} />
      </SocialMediaMetadata>
      <StyledMain>
        <ProgrammeWrapper data-testid="programme-list">
          <Programmes programmes={programmes} loading={fpQuery.loading} />
        </ProgrammeWrapper>
        {article && (
          <FrontpageArticle isWide id={SKIP_TO_CONTENT_ID} article={article} />
        )}
      </StyledMain>
    </>
  );
};

export default WelcomePage;
