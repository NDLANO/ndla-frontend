/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export const RESOURCE_TYPE_LEARNING_PATH = 'urn:resourcetype:learningPath';
export const RESOURCE_TYPE_SUBJECT_MATERIAL =
  'urn:resourcetype:subjectMaterial';
export const RESOURCE_TYPE_TASKS_AND_ACTIVITIES =
  'urn:resourcetype:tasksAndActivities';
export const RESOURCE_TYPE_ASSESSMENT_RESOURCES =
  'urn:resourcetype:reviewResource';
export const RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES =
  'urn:resourcetype:externalResource';
export const RESOURCE_TYPE_SOURCE_MATERIAL = 'urn:resourcetype:SourceMaterial';

export const RELEVANCE_CORE = 'urn:relevance:core';
export const RELEVANCE_SUPPLEMENTARY = 'urn:relevance:supplementary';

export const NOT_FOUND_PAGE_PATH = '/404';
export const FILM_PAGE_PATH = '/subject:20';
export const UKR_PAGE_PATH = '/subject:27e8623d-c092-4f00-9a6f-066438d6c466';
export const MULTIDISCIPLINARY_SUBJECT_ID =
  'urn:subject:d1fe9d0a-a54d-49db-a4c2-fd5463a7c9e7';
export const TOOLBOX_TEACHER_SUBJECT_ID =
  'urn:subject:1:9bb7b427-3f5b-4c45-9719-efc509f3d9cc';
export const TOOLBOX_STUDENT_SUBJECT_ID =
  'urn:subject:1:54b1727c-2d91-4512-901c-8434e13339b4';

export const SKIP_TO_CONTENT_ID = 'SkipToContentId';
export const SUPPORTED_LANGUAGES = ['nb', 'nn', 'en', 'se'];
export const STORED_LANGUAGE_COOKIE_KEY = 'language';
export const STORED_RESOURCE_VIEW_SETTINGS = 'STORED_RESOURCE_VIEW_SETTINGS';

export const PROGRAMME_PATH = '/utdanning';

export const ABOUT_PATH = '/about/';

export const PODCAST_SERIES_PAGE_PATH = '/podkast/:id';
export const PODCAST_SERIES_LIST_PAGE_PATH = '/podkast';
export const TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES = 'topic-resources';
export const TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE = 'ungrouped';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY = 'subjectCategory';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE = 'subjectType';
export const TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT = 'forklaringsfag';
export const OLD_SUBJECT_PAGE_REDIRECT_CUSTOM_FIELD = 'old-subject-id';

export const LocaleValues = ['nb', 'nn', 'en', 'se'] as const;

export const MastheadHeightPx = 84; // See `misc` in @ndla/core for origin
export const EmotionCacheKey = 'css';

export const AcquireLicensePage =
  'https://ndla.zendesk.com/hc/no/articles/360000945552-Bruk-av-lisenser-og-lisensiering';

export const aboutNdlaUrl = 'https://om.ndla.no/';
export const aboutNdlaContentWidth = 1440;

export const programmeRedirects: Record<string, string> = {
  'bygg-og-anleggsteknikk': 'bygg-og-anleggsteknikk__847f59182173',
  'elektro-og-datateknologi': 'elektro-og-datateknologi__55ad4a85ba78',
  'frisør-blomster-interior-og-eksponeringsdesign':
    'frisor-blomster-interiør-og-eksponeringsdesign__235c13273508',
  'handverk-design-og-produktutvikling':
    'håndverk-design-og-produktutvikling__28899b73c188',
  'helse-og-oppvekstfag': 'helse-og-oppvekstfag__5ad439a5dacb',
  idrettsfag: 'idrettsfag__dd37b407714d',
  'informasjonsteknologi-og-medieproduksjon':
    'informasjonsteknologi-og-medieproduksjon__23f18a24131e',
  'kunst-design-og-arkitektur': 'kunst-design-og-arkitektur__72376dcfd25a',
  'medier-og-kommunikasjon': 'medier-og-kommunikasjon__57b0e8cd7270',
  'musikk-dans-og-drama': 'musikk-dans-og-drama__338394ba465c',
  naturbruk: 'naturbruk__d23305736cde',
  pabygg: 'påbygg__6ea1ed34e5e7',
  'restaurant-og-matfag': 'restaurant-og-matfag__0a0cd4e39743',
  'salg-service-og-reiseliv': 'salg-service-og-reiseliv__b55100bbc29e',
  studiespesialisering: 'studiespesialisering__7d5badf01ff2',
  'teknologi-og-industrifag': 'teknologi-og-industrifag__a920d0b5cbbb',
};

export interface LinkType {
  link: string;
  key: string;
  subTypes?: LinkType[];
}

const whoAreWe: LinkType = {
  key: 'whoAreWe',
  link: `${aboutNdlaUrl}hvem-er-vi/`,
  subTypes: [
    { key: 'organizing', link: `${aboutNdlaUrl}organisering/` },
    { key: 'keyPersonnel', link: `${aboutNdlaUrl}nokkelpersoner/` },
    { key: 'articlesOfAssociation', link: `${aboutNdlaUrl}vedtekter/` },
    { key: 'history', link: `${aboutNdlaUrl}ndlas-historie/` },
  ],
};

const whatWeDo: LinkType = {
  key: 'whatWeDo',
  link: `${aboutNdlaUrl}hva-gjor-vi/`,
  subTypes: [
    { key: 'communityPurpose', link: `${aboutNdlaUrl}vart-samfunnsoppdrag/` },
    { key: 'vision', link: `${aboutNdlaUrl}visjon-og-verdier-2/` },
    { key: 'numbers', link: `${aboutNdlaUrl}tall-og-rapporter-2/` },
    { key: 'cooperation', link: `${aboutNdlaUrl}vare-samarbeid/` },
  ],
};

const careers: LinkType = {
  key: 'careers',
  link: `${aboutNdlaUrl}bli-med-pa-laget/`,
  subTypes: [{ key: 'vacancies', link: `${aboutNdlaUrl}utlysninger/` }],
};

const contactUs: LinkType = {
  key: 'contactUs',
  link: `${aboutNdlaUrl}kontakt-oss-2/`,
};

export const ndlaLinks: LinkType = {
  key: 'title',
  link: aboutNdlaUrl,
  subTypes: [whoAreWe, whatWeDo, careers, contactUs],
};
