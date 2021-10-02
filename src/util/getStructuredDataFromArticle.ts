/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from 'date-fns/format';
import {
  GQLArticle,
  GQLAudioLicense,
  GQLBrightcoveLicense,
  GQLContributor,
  GQLCopyright,
  GQLImageLicense,
} from '../graphqlTypes';
import config from '../config';

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
    item: { '@type': string; id: string };
  }[];
  '@type'?: string;
  '@context'?: string;
  '@id'?: string;
}

interface Mediaelements {
  data: GQLImageLicense | GQLAudioLicense | GQLBrightcoveLicense | null;
  type: string;
}

type Breadcrumb = {
  id: string;
  name: string;
  to: string;
};

const CREATIVE_WORK_TYPE = 'Article';
const BREADCRUMB_TYPE = 'BreadcrumbList';
const ITEM_TYPE = 'ListItem';
const THING_TYPE = 'Thing';

const PERSON_TYPE = 'Person';
const ORGANIZATION_TYPE = 'Organization';
const IMAGE_TYPE = 'ImageObject';
const VIDEO_TYPE = 'VideoObject';
const AUDIO_TYPE = 'AudioObject';

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

const getCopyrightData = (copyright: GQLCopyright): StructuredData => {
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
    item: {
      '@type': THING_TYPE,
      id: `${config.ndlaFrontendDomain}${item.to}`,
    },
  }));

  return {
    ...structuredDataBase,
    '@type': BREADCRUMB_TYPE,
    numberOfItems: breadcrumbItems.length,
    itemListELement: items,
  };
};

const getStructuredDataFromArticle = (
  article: GQLArticle,
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
      ...getCopyrightData(data?.copyright!),
    };
  });

const createVideoData = (videos: GQLBrightcoveLicense[]): StructuredData[] =>
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
      uploadDate: format(video?.uploadDate!, 'YYYY-MM-DD'),
      ...getCopyrightData(video?.copyright!),
    };
  });

export default getStructuredDataFromArticle;
