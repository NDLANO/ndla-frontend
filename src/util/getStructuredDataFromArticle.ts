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
  GQLStructuredArticleData_BrightcoveLicenseFragment,
  GQLStructuredArticleData_ImageLicenseFragment,
} from '../graphqlTypes';
import config from '../config';
import { Breadcrumb } from '../interfaces';

type CopyrightHolder = { '@type': string; name?: string };
interface StructuredData {
  embedUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  contentUrl?: string;
  uploadDate?: string;
  copyrightHolder?: CopyrightHolder[];
  contributor?: CopyrightHolder[];
  license?: string;
  author?: CopyrightHolder[];
  name?: string;
  headline?: string;
  abstract?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  numberOfItems?: number;
  itemListELement?: {
    '@type': string;
    name?: string;
    position: number;
    item: string;
  }[];
  '@type'?: string;
  '@context'?: string;
  '@id'?: string;
}

interface Mediaelements {
  data:
    | GQLStructuredArticleData_ImageLicenseFragment
    | GQLStructuredArticleData_AudioLicenseFragment
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

const acquireLicensePage =
  'https://ndla.zendesk.com/hc/no/articles/360000945552-Bruk-av-lisenser-og-lisensiering';

const publisher = {
  publisher: {
    '@type': ORGANIZATION_TYPE,
    name: 'NDLA',
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
  arr?.map(item => ({
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
    title
    metaDescription
    published
    updated
    copyright {
      ...StructuredArticleData_Copyright
    }
    metaImage {
      url
    }
    metaData {
      images {
        ...StructuredArticleData_ImageLicense
      }
      audios {
        ...StructuredArticleData_AudioLicense
      }
      brightcoves {
        ...StructuredArticleData_BrightcoveLicense
      }
    }
  }
  ${structuredArticleCopyrightFragment}
  ${brightcoveLicenseFragment}
  ${audioLicenseFragment}
  ${imageLicenseFragment}
`;

const getStructuredDataFromArticle = (
  article: GQLStructuredArticleDataFragment,
  breadcrumbItems?: Breadcrumb[],
) => {
  const articleData: StructuredData = {
    ...structuredDataBase,
    '@type': CREATIVE_WORK_TYPE,
    name: article.title,
    headline: article.title,
    abstract: article.metaDescription,
    datePublished: format(article.published, 'YYYY-MM-DD'),
    dateModified: format(article.updated, 'YYYY-MM-DD'),
    image: article.metaImage?.url,
    ...publisher,
    ...getCopyrightData(article.copyright),
  };

  const crumbs = getBreadcrumbs(breadcrumbItems);
  const structuredData = crumbs ? [articleData, crumbs] : [articleData];

  const metaData = article.metaData;
  const images = metaData?.images?.map(i => ({ data: i, type: IMAGE_TYPE }));
  const audios = metaData?.audios?.map(a => ({ data: a, type: AUDIO_TYPE }));

  const mediaElements: Mediaelements[] = [...(images ?? []), ...(audios ?? [])];
  const videos = article.metaData?.brightcoves || [];

  const mediaData = createMediaData(mediaElements);
  const videoData = createVideoData(videos);

  return [...structuredData, ...mediaData, ...videoData];
};

const createMediaData = (media: Mediaelements[]): StructuredData[] =>
  media.map(media => {
    const { data, type } = media;
    return {
      ...structuredDataBase,
      '@type': type,
      '@id': data?.src,
      name: data?.title,
      contentUrl: data?.src,
      acquireLicensePage,
      ...getCopyrightData(data?.copyright!),
    };
  });

const createVideoData = (
  videos: GQLStructuredArticleData_BrightcoveLicenseFragment[],
): StructuredData[] =>
  videos.map(video => {
    return {
      ...structuredDataBase,
      '@type': VIDEO_TYPE,
      '@id': video?.src,
      name: video?.title,
      embedUrl: video?.src,
      thumbnailUrl: video?.cover,
      description: video?.description,
      contentUrl: video?.download,
      acquireLicensePage,
      uploadDate: format(video?.uploadDate!, 'YYYY-MM-DD'),
      ...getCopyrightData(video?.copyright!),
    };
  });

export default getStructuredDataFromArticle;
