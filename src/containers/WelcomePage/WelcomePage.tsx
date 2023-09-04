/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useMemo } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  ProgrammeV2,
  FrontpageArticle,
  WIDE_FRONTPAGE_ARTICLE_MAX_WIDTH,
  BannerCard,
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

import WelcomePageInfo from './WelcomePageInfo';
import FrontpageSubjects from './FrontpageSubjects';
import {
  FILM_PAGE_PATH,
  PROGRAMME_PATH,
  SKIP_TO_CONTENT_ID,
} from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import {
  GQLFrontpageDataQuery,
  GQLFrontpageSubjectsQuery,
  GQLProgrammePage,
} from '../../graphqlTypes';
import Programmes from './Components/Programmes';
import FrontpageMultidisciplinarySubject from './FrontpageMultidisciplinarySubject';
import FrontpageToolbox from './FrontpageToolbox';
import { useEnableTaxStructure } from '../../components/TaxonomyStructureContext';
import LicenseBox from '../../components/license/LicenseBox';
import { structuredArticleDataFragment } from '../../util/getStructuredDataFromArticle';
import { useGraphQuery } from '../../util/runQueries';
import { transformArticle } from '../../util/transformArticle';
import { getArticleScripts } from '../../util/getArticleScripts';

const BannerWrapper = styled.div`
  margin-bottom: ${spacing.normal};
`;

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

const frontpageSubjectsQuery = gql`
  query frontpageSubjects {
    subjects(filterVisible: true) {
      id
      name
      path
      metadata {
        customFields
      }
    }
  }
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
  const taxonomyProgrammesEnabled = useEnableTaxStructure();
  const subjectsQuery = useGraphQuery<GQLFrontpageSubjectsQuery>(
    frontpageSubjectsQuery,
    { skip: typeof window === 'undefined' },
  );

  const fpQuery = useGraphQuery<GQLFrontpageDataQuery>(frontpageQuery, {
    skip: !taxonomyProgrammesEnabled,
  });

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
        introduction: transformedArticle.introduction ?? '',
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
      {!taxonomyProgrammesEnabled && (
        <FrontpageHeader locale={i18n.language} showHeader={true}>
          <WelcomePageSearch />
        </FrontpageHeader>
      )}
      {taxonomyProgrammesEnabled && article ? (
        <StyledMain>
          <ProgrammeWrapper data-testid="programme-list">
            <Programmes programmes={programmes} loading={fpQuery.loading} />
          </ProgrammeWrapper>
          <FrontpageArticle isWide id={SKIP_TO_CONTENT_ID} article={article} />
        </StyledMain>
      ) : (
        <main>
          <OneColumn wide>
            <BannerWrapper>
              <BannerCard
                link="https://blogg.ndla.no/laeremidlene-du-trenger-til-skolearet/"
                title={{ title: t('campaignBlock.title'), lang: i18n.language }}
                image={{
                  imageSrc: '/static/planlegg_skolearet.jpeg',
                  altText: '',
                }}
                linkText={{
                  text: t('campaignBlock.linkText'),
                  lang: i18n.language,
                }}
                content={{
                  content: t('campaignBlock.ingress'),
                  lang: i18n.language,
                }}
              />
            </BannerWrapper>
            <div data-testid="category-list" id={SKIP_TO_CONTENT_ID}>
              <FrontpageSubjects
                locale={i18n.language}
                subjects={subjectsQuery?.data?.subjects}
              />
            </div>
          </OneColumn>
          <OneColumn wide>
            <FrontpageMultidisciplinarySubject />
            <FrontpageToolbox />
            <BlogPosts locale={i18n.language} />
            <FrontpageFilm
              imageUrl="/static/film_illustrasjon.svg"
              url={FILM_PAGE_PATH}
            />
            <WelcomePageInfo />
          </OneColumn>
        </main>
      )}
    </>
  );
};

export default WelcomePage;
