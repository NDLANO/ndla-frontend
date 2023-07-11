/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import {
  FrontpageHeader,
  FrontpageFilm,
  OneColumn,
  ProgrammeV2,
} from '@ndla/ui';
import { utils } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';

import WelcomePageInfo from './WelcomePageInfo';
import { FILM_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { GQLFrontpageDataQuery, GQLProgrammePage } from '../../graphqlTypes';
import Programme from './Components/Programme';
import FrontpageMultidisciplinarySubject from './FrontpageMultidisciplinarySubject';
import FrontpageToolbox from './FrontpageToolbox';

const HiddenHeading = styled.h1`
  ${utils.visuallyHidden};
`;

const frontpageQuery = gql`
  query frontpageData {
    programmes {
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
  }
`;

const formatProgrammes = (data: GQLProgrammePage[]): ProgrammeV2[] => {
  return data.map((p) => {
    return {
      id: p.id,
      title: p.title,
      desktopImage: {
        src: p.desktopImage?.url || '',
        alt: p.desktopImage?.alt || ''
      },
      mobileImage: {
        src: p.mobileImage?.url || '',
        alt: p.mobileImage?.alt || ''
      },
      url: p.url || '',
    };
  });
};

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const [fetchData, { data }] =
    useLazyQuery<GQLFrontpageDataQuery>(frontpageQuery);
  const [programmes, setProgrammes] = useState<ProgrammeV2[]>([]);

  useEffect(() => {
    const getData = async () => {
      fetchData();
    };
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.programmes) {
      setProgrammes(formatProgrammes(data.programmes));
    }
  }, [data]);

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
      <FrontpageHeader locale={i18n.language} showHeader={true}>
        <WelcomePageSearch />
      </FrontpageHeader>
      <main>
        <OneColumn wide>
          <Programme programmes={programmes} />
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
    </>
  );
};

export default WelcomePage;
