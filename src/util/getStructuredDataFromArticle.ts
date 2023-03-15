/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import format from 'date-fns/format';
import {
  GQLContributor,
  GQLStructuredArticleData_CopyrightFragment,
  GQLStructuredArticleDataFragment,
  GQLStructuredArticleData_AudioLicenseFragment,
  GQLStructuredArticleData_PodcastLicenseFragment,
  GQLStructuredArticleData_BrightcoveLicenseFragment,
  GQLStructuredArticleData_ImageLicenseFragment,
} from '../graphqlTypes';
import config from '../config';
import { AcquireLicensePage } from '../constants';
import { Breadcrumb } from '../interfaces';

type CopyrightHolder = { '@type': string; name?: string };
type Alignment = {
  '@type': string;
  alignmentType: string;
  educationalFramework: string;
  targetDescription?: string;
  targetName?: string;
  targetUrl?: string;
};
interface StructuredData {
  '@type'?: string;
  '@context'?: string;
  '@id'?: string;
  abstract?: string;
  audience?: {
    '@type': string;
    educationalRole: string[];
  };
  author?: CopyrightHolder[];
  contentUrl?: string;
  contributor?: CopyrightHolder[];
  copyrightHolder?: CopyrightHolder[];
  dateCreated?: string;
  dateModified?: string;
  datePublished?: string;
  description?: string;
  educationalAlignment?: Alignment[];
  educationalRole?: string;
  embedUrl?: string;
  headline?: string;
  identifier?: string;
  image?: string;
  inLanguage?: string;
  itemListELement?: {
    '@type': string;
    name?: string;
    item: string;
    position: number;
  }[];
  learningResourceType?: string[];
  license?: string;
  name?: string;
  numberOfItems?: number;
  thumbnailUrl?: string;
  uploadDate?: string;
}

interface Mediaelements {
  data:
    | GQLStructuredArticleData_ImageLicenseFragment
    | GQLStructuredArticleData_AudioLicenseFragment
    | GQLStructuredArticleData_PodcastLicenseFragment
    | GQLStructuredArticleData_BrightcoveLicenseFragment
    | null;
  type: string;
}

const CREATIVE_WORK_TYPE = 'Article';
const BREADCRUMB_TYPE = 'BreadcrumbList';
const ITEM_TYPE = 'ListItem';

const PERSON_TYPE = 'Person';
const ORGANIZATION_TYPE = 'Organization';
const IMAGE_TYPE = 'ImageObject';
const VIDEO_TYPE = 'VideoObject';
const AUDIO_TYPE = 'AudioObject';
const PODCAST_TYPE = 'PodcastEpisode';
const AUDIENCE_TYPE = 'EducationalAudience';

export const publisher = {
  publisher: {
    '@type': ORGANIZATION_TYPE,
    name: 'NDLA',
    legalName: 'NDLA',
    url: 'https://ndla.no',
    logo: 'https://ndla.no/static/logo.png',
  },
};

const structuredDataBase = {
  '@context': 'http://schema.org',
};

const mapType = (
  type: typeof PERSON_TYPE | typeof ORGANIZATION_TYPE,
  arr?: GQLContributor[],
) =>
  arr?.map((item) => ({
    '@type': type,
    name: item.name,
  }));

const getCopyrightData = (
  copyright: GQLStructuredArticleData_CopyrightFragment,
): StructuredData => {
  const { creators, rightsholders, license, processors } = copyright;
  return {
    license: license?.url,
    author: mapType(PERSON_TYPE, creators),
    copyrightHolder: mapType(ORGANIZATION_TYPE, rightsholders),
    contributor: mapType(PERSON_TYPE, processors),
  };
};

const getBreadcrumbs = (
  breadcrumbItems?: Breadcrumb[],
): StructuredData | undefined => {
  if (!breadcrumbItems) {
    return undefined;
  }
  const items = breadcrumbItems.map((item, index) => ({
    '@type': ITEM_TYPE,
    name: item.name,
    position: index + 1,
    item: `${config.ndlaFrontendDomain}${item.to}`,
  }));

  return {
    ...structuredDataBase,
    '@type': BREADCRUMB_TYPE,
    numberOfItems: breadcrumbItems.length,
    itemListELement: items,
  };
};

const getAllignments = (
  article: GQLStructuredArticleDataFragment,
): Alignment[] | undefined => {
  const core = article.coreElements
    ? article.coreElements?.map((ce) => {
        return {
          '@type': 'AlignmentObject',
          alignmentType: 'assesses',
          educationalFramework: 'LK20',
          targetDescription: ce.title,
          targetName: ce.id,
          targetUrl: `http://psi.udir.no/kl06/${ce.id}`,
        };
      })
    : [];
  const goals = article.competenceGoals
    ? article.competenceGoals?.map((kg) => {
        return {
          '@type': 'AlignmentObject',
          alignmentType: 'teaches',
          educationalFramework: kg.type,
          targetDescription: kg.title,
          targetName: kg.code || kg.id,
          targetUrl: `http://psi.udir.no/kl06/${kg.code || kg.id}`,
        };
      })
    : [];
  return [...core, ...goals];
};

export const structuredArticleCopyrightFragment = gql`
  fragment StructuredArticleData_Copyright on Copyright {
    license {
      url
    }
    creators {
      name
      type
    }
    processors {
      name
      type
    }
    rightsholders {
      name
      type
    }
  }
`;

const imageLicenseFragment = gql`
  fragment StructuredArticleData_ImageLicense on ImageLicense {
    src
    title
    copyright {
      ...StructuredArticleData_Copyright
    }
  }
`;

const audioLicenseFragment = gql`
  fragment StructuredArticleData_AudioLicense on AudioLicense {
    src
    title
    copyright {
      ...StructuredArticleData_Copyright
    }
  }
`;

const podcastLicenseFragment = gql`
  fragment StructuredArticleData_PodcastLicense on PodcastLicense {
    src
    title
    description
    copyright {
      ...StructuredArticleData_Copyright
    }
  }
`;

const brightcoveLicenseFragment = gql`
  fragment StructuredArticleData_BrightcoveLicense on BrightcoveLicense {
    src
    title
    cover
    description
    download
    uploadDate
    copyright {
      ...StructuredArticleData_Copyright
    }
  }
`;

export const structuredArticleDataFragment = gql`
  fragment StructuredArticleData on Article {
    id
    title
    metaDescription
    published
    updated
    supportedLanguages
    copyright {
      ...StructuredArticleData_Copyright
    }
    metaImage {
      url
    }
    availability
    competenceGoals {
      id
      code
      title
      type
    }
    coreElements {
      id
      title
    }
    metaData {
      images {
        ...StructuredArticleData_ImageLicense
      }
      audios {
        ...StructuredArticleData_AudioLicense
      }
      podcasts {
        ...StructuredArticleData_PodcastLicense
      }
      brightcoves {
        ...StructuredArticleData_BrightcoveLicense
      }
    }
  }
  ${structuredArticleCopyrightFragment}
  ${brightcoveLicenseFragment}
  ${audioLicenseFragment}
  ${podcastLicenseFragment}
  ${imageLicenseFragment}
`;

const getStructuredDataFromArticle = (
  article: GQLStructuredArticleDataFragment,
  language: string,
  breadcrumbItems?: Breadcrumb[],
) => {
  const inLanguage = article.supportedLanguages?.includes(language)
    ? language
    : article.supportedLanguages?.[0] ?? language;
  const educationalAlignment = getAllignments(article);
  const articleData: StructuredData = {
    ...structuredDataBase,
    '@type': CREATIVE_WORK_TYPE,
    '@id': `${config.ndlaFrontendDomain}/article/${article.id}`,
    identifier: `${config.ndlaFrontendDomain}/article/${article.id}`,
    inLanguage: inLanguage,
    learningResourceType: ['text'],
    name: article.title,
    headline: article.title,
    abstract: article.metaDescription,
    audience: {
      '@type': AUDIENCE_TYPE,
      educationalRole: [
        article.availability === 'teacher' ? 'teacher' : 'student',
      ],
    },
    description: article.metaDescription,
    dateCreated: article.published
      ? format(new Date(article.published), 'yyyy-MM-dd')
      : undefined,
    datePublished: article.published
      ? format(new Date(article.published), 'yyyy-MM-dd')
      : undefined,
    dateModified: article.updated
      ? format(new Date(article.updated), 'yyyy-MM-dd')
      : undefined,
    educationalAlignment,
    image: article.metaImage?.url,
    thumbnailUrl: article.metaImage?.url,
    ...publisher,
    ...getCopyrightData(article.copyright),
  };

  const crumbs = getBreadcrumbs(breadcrumbItems);
  const structuredData = crumbs ? [articleData, crumbs] : [articleData];

  const metaData = article.metaData;
  const images = metaData?.images?.map((i) => ({ data: i, type: IMAGE_TYPE }));
  const audios = metaData?.audios?.map((a) => ({ data: a, type: AUDIO_TYPE }));

  const mediaElements: Mediaelements[] = [...(images ?? []), ...(audios ?? [])];
  const podcasts = article.metaData?.podcasts || [];
  const videos = article.metaData?.brightcoves || [];

  const mediaData = createMediaData(mediaElements);
  const podcastData = createPodcastData(podcasts);
  const videoData = createVideoData(videos);

  return [...structuredData, ...mediaData, ...podcastData, ...videoData];
};

const createMediaData = (media: Mediaelements[]): StructuredData[] =>
  media.map((media) => {
    const { data, type } = media;
    return {
      ...structuredDataBase,
      '@type': type,
      '@id': data?.src,
      name: data?.title,
      contentUrl: data?.src,
      acquireLicensePage: AcquireLicensePage,
      ...getCopyrightData(data?.copyright!),
    };
  });

const createPodcastData = (
  podcasts: GQLStructuredArticleData_PodcastLicenseFragment[],
): StructuredData[] =>
  podcasts.map((podcast) => {
    return {
      ...structuredDataBase,
      '@type': PODCAST_TYPE,
      '@id': podcast?.src,
      name: podcast?.title,
      audio: {
        '@type': AUDIO_TYPE,
        contentUrl: podcast?.src,
      },
      abstract: podcast?.description,
      acquireLicensePage: AcquireLicensePage,
      ...getCopyrightData(podcast?.copyright!),
    };
  });

const createVideoData = (
  videos: GQLStructuredArticleData_BrightcoveLicenseFragment[],
): StructuredData[] =>
  videos.map((video) => {
    return {
      ...structuredDataBase,
      '@type': VIDEO_TYPE,
      '@id': video?.src,
      name: video?.title,
      embedUrl: video?.src,
      thumbnailUrl: video?.cover,
      description: video?.description,
      acquireLicensePage: AcquireLicensePage,
      uploadDate: video?.uploadDate
        ? format(new Date(video?.uploadDate!), 'yyyy-mm-dd')
        : undefined,
      ...getCopyrightData(video?.copyright!),
    };
  });

export default getStructuredDataFromArticle;
