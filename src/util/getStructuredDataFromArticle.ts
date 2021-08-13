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

const CREATIVE_WORK_TYPE = 'Article';
const BREADCRUMB_TYPE = 'BreadcrumbList';
const ITEM_TYPE = 'ListItem';
const THING_TYPE = 'Thing';

const PERSON_TYPE = 'Person';
const ORGANIZATION_TYPE = 'Organization';
const IMAGE_TYPE = 'ImageObject';
const VIDEO_TYPE = 'VideoObject';
const AUDIO_TYPE = 'AudioObject';

const getStructuredDataBase = () => ({
  '@context': 'http://schema.org',
});

const mapType = (
  type: typeof PERSON_TYPE | typeof ORGANIZATION_TYPE,
  arr?: GQLContributor[],
) => {
  return arr?.map(item => {
    return {
      '@type': type,
      name: item.name,
    };
  });
};

const getCopyrightData = ({
  creators,
  rightsholders,
  license,
  processors,
}: GQLCopyright) => {
  const data: StructuredData = {
    license: license?.url,
  };

  data.author = mapType(PERSON_TYPE, creators);
  data.copyrightHolder = mapType(ORGANIZATION_TYPE, rightsholders);
  data.contributor = mapType(PERSON_TYPE, processors);
  return data;
};

const getPublisher = () => {
  const data = {
    publisher: {
      '@type': ORGANIZATION_TYPE,
      name: 'NDLA',
      url: 'https://ndla.no',
      logo: 'https://ndla.no/static/logo.png',
    },
  };
  return data;
};
type Breadcrumb = {
  id: String;
  name: String;
  to: String;
};

const getBreadcrumbs = (breadcrumbItems?: Breadcrumb[]) => {
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

  let data: StructuredData = getStructuredDataBase();
  data['@type'] = BREADCRUMB_TYPE;
  data.numberOfItems = breadcrumbItems.length;
  data.itemListELement = items;

  return data;
};

type CopyrightHolder = { '@type': String; name?: String };
interface StructuredData {
  embedUrl?: String;
  thumbnailUrl?: String;
  description?: String;
  contentUrl?: String;
  uploadDate?: String;
  copyrightHolder?: CopyrightHolder[];
  contributor?: CopyrightHolder[];
  license?: String;
  author?: CopyrightHolder[];
  name?: String;
  headline?: String;
  abstract?: String;
  datePublished?: String;
  dateModified?: String;
  image?: String;
  numberOfItems?: number;
  itemListELement?: {
    '@type': String;
    name?: String;
    position: number;
    item: { '@type': String; id: String };
  }[];
  '@type'?: String;
  '@context'?: String;
  '@id'?: String;
}

interface Mediaelements {
  data: GQLImageLicense | GQLAudioLicense | GQLBrightcoveLicense | null;
  type: String;
}

const getStructuredDataFromArticle = (
  article: GQLArticle,
  breadcrumbItems?: Breadcrumb[],
) => {
  let articleData: StructuredData = getStructuredDataBase();
  articleData['@type'] = CREATIVE_WORK_TYPE;
  articleData.name = article.title;
  articleData.headline = article.title;
  articleData.abstract = article.metaDescription;
  articleData.datePublished = format(article.published, 'YYYY-MM-DD');
  articleData.dateModified = format(article.updated, 'YYYY-MM-DD');
  articleData.image = article.metaImage?.url;

  articleData = {
    ...articleData,
    ...getPublisher(),
    ...getCopyrightData(article.copyright),
  };

  const structuredDataCollection = [articleData];

  const breadcrumbs = getBreadcrumbs(breadcrumbItems);
  if (breadcrumbs) {
    structuredDataCollection.push(breadcrumbs);
  }

  const images =
    article.metaData?.images?.map(i => ({ data: i, type: IMAGE_TYPE })) ?? [];
  const audios =
    article.metaData?.audios?.map(a => ({ data: a, type: AUDIO_TYPE })) ?? [];

  const mediaElements: Mediaelements[] = [...images, ...audios];
  const videos = article.metaData?.brightcoves || [];

  createStructuredDataMedia(mediaElements, structuredDataCollection);
  createStructuredDataVideo(videos, structuredDataCollection);

  return structuredDataCollection;
};

const createStructuredDataMedia = (
  mediaElements: Mediaelements[],
  structuredCollection: StructuredData[],
) => {
  mediaElements.forEach(media => {
    const { data, type } = media;

    let structuredData: StructuredData = getStructuredDataBase();
    structuredData['@type'] = type;
    structuredData['@id'] = data?.src;
    structuredData.name = data?.title;
    structuredData.contentUrl = data?.src;

    structuredData = {
      ...structuredData,
      ...getCopyrightData(data?.copyright!),
    };

    structuredCollection.push(structuredData);
  });
};

const createStructuredDataVideo = (
  videos: GQLBrightcoveLicense[],
  structuredCollection: StructuredData[],
) => {
  videos.forEach(video => {
    let structuredData: StructuredData = getStructuredDataBase();

    structuredData['@type'] = VIDEO_TYPE;
    structuredData['@id'] = video?.src;
    structuredData.name = video?.title;
    structuredData.embedUrl = video?.src;
    structuredData.thumbnailUrl = video?.cover;
    structuredData.description = video?.description;
    structuredData.contentUrl = video?.download;
    structuredData.uploadDate = format(video?.uploadDate!, 'YYYY-MM-DD');

    structuredData = {
      ...structuredData,
      ...getCopyrightData(video?.copyright!),
    };

    structuredCollection.push(structuredData);
  });
};

export default getStructuredDataFromArticle;
