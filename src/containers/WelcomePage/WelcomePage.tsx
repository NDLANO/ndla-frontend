/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useEffect } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { FrontpageHeader, FrontpageFilm, OneColumn } from '@ndla/ui';
import { utils } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { gql, useLazyQuery } from '@apollo/client';

import WelcomePageInfo from './WelcomePageInfo';
import { FILM_PAGE_PATH } from '../../constants';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import config from '../../config';
import BlogPosts from './BlogPosts';
import WelcomePageSearch from './WelcomePageSearch';
import { GQLSubjectsQuery } from '../../graphqlTypes';
import Programme from './Components/Programme';
import FrontpageMultidisciplinarySubject from './FrontpageMultidisciplinarySubject';
import FrontpageToolbox from './FrontpageToolbox';

const HiddenHeading = styled.h1`
  ${utils.visuallyHidden};
`;
export const programmeV2 = [
  {
    id: 'Bygg og anleggsteknikk',
    title: { title: 'Bygg og anleggsteknikk', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/N8X0h6Ns.svg?width=600&ts=1686832638131',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/FFHsjf6w.svg?width=600&ts=1686832507880',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Elektro og datateknologi',
    title: { title: 'Elektro og datateknologi', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/ajvkVKKR.svg?width=600&ts=1687161897845',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/YIAprLg9.svg?width=600&ts=1686832845563',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Frisør, blomster, interiør og eksponeringsdesign',
    title: {
      title: 'Frisør, blomster, interiør og eksponeringsdesign',
      language: 'nb',
    },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/HOpbfdEN.svg?width=600&ts=1687161692506',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/M3Ewo0Ep.svg?width=600&ts=1686900374397',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Helse- og oppvekstfag',
    title: { title: 'Helse- og oppvekstfag', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/twPSlbya.svg?width=600&ts=1687161979051',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/BCQEgA9V.svg?width=600&ts=1686900446038',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Håndverk, design og produktutvikling',
    title: { title: 'Håndverk, design og produktutvikling', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/jeBYkPch.svg?width=600&ts=1687161756903',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/vO2tqCig.svg?width=600&ts=1686832880287',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Idrett',
    title: { title: 'Idrett', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/L688LsSK.svg?width=600&ts=1687161944101',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/OxtI1BCR.svg?width=600&ts=1686900669797',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Informasjonsteknologi og medieproduksjon',
    title: {
      title: 'Informasjonsteknologi og medieproduksjon',
      language: 'nb',
    },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/30gBrWT8.svg?width=600&ts=1687161807044',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/YK1fgZEt.svg?width=600&ts=1686900687635',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Kunst, design og arkitektur',
    title: { title: 'Kunst, design og arkitektur', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/kam1TYh2.svg?width=600&ts=1687161784488',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/2U6k3rWi.svg?width=600&ts=1686832884034',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Medie og kommunikasjon',
    title: { title: 'Medie og kommunikasjon', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/30gBrWT8.svg?width=600&ts=1687162057423',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/pTfU8vaN.svg?width=600&ts=1686900724635',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Musikk, dans og drama',
    title: { title: 'Musikk, dans og drama', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/N3cG9YCv.svg?width=600&ts=1687161847807',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/2TXzi1QY.svg?width=600&ts=1686832881769',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Naturbruk',
    title: { title: 'Naturbruk', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/ycv7E3Gz.svg?width=600&ts=1687161863325',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/gbsSv7aF.svg?width=600&ts=1686900755181',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Påbygg',
    title: { title: 'Påbygg', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/h3H0Q3Au.svg?width=600&ts=1687161637695',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/FFHsjf6w.svg?width=600&ts=1686900773999',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Resturant og matfag',
    title: { title: 'Resturant og matfag', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/sDXXoqps.svg?width=600&ts=1687161605145',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/TcAjLAdb.svg?width=600&ts=1686900804205',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Salg, service og reiseliv',
    title: { title: 'Salg, service og reiseliv', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/f8opWO5y.svg?width=600&ts=1687161736148',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/XRJl0bfy.svg?width=600&ts=1686901107920',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Studiespesialiserende',
    title: { title: 'Studiespesialiserende', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/c3oZ4Czy.svg?width=600&ts=1687161709890',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/M37scG26.png?width=600&ts=1687253614052s',
      alt: '',
    },
    url: '#',
  },
  {
    id: 'Teknologi og industrifag',
    title: { title: 'Teknologi og industrifag', language: 'nb' },
    desktopImage: {
      src: 'https://api.test.ndla.no/image-api/raw/bfRtsr7h.svg?width=600&ts=1687161658994',
      alt: '',
    },
    mobileImage: {
      src: 'https://api.test.ndla.no/image-api/raw/3ECmPLmR.svg?width=600&ts=1686901280129',
      alt: '',
    },
    url: '#',
  },
];

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

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const [fetchData] = useLazyQuery<GQLSubjectsQuery>(frontpageSubjectsQuery);

  useEffect(() => {
    const getData = () => {
      fetchData();
    };
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          <Programme programmes={programmeV2} />
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
