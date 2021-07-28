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

const getCopyrightData = ({
  creators,
  rightsholders,
  license,
  processors,
}: GQLCopyright) => {
  const data: StructuredData = {
    license: license?.url,
  };

  const author = creators?.map(c => {
    return {
      '@type': PERSON_TYPE,
      name: c?.name,
    };
  });
  if (author && author.length > 0) {
    data.author = author;
  }

  const copyrightHolder = rightsholders?.map(r => {
    return {
      '@type': ORGANIZATION_TYPE,
      name: r?.name,
    };
  });
  if (copyrightHolder && copyrightHolder.length > 0) {
    data.copyrightHolder = copyrightHolder;
  }

  const contributor = processors?.map(c => {
    return {
      '@type': PERSON_TYPE,
      name: c?.name,
    };
  });
  if (contributor && contributor.length > 0) {
    data.contributor = contributor;
  }

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
  id?: string;
  name?: string;
  to?: string;
};

const getBreadcrumbs = (breadcrumbItems: Breadcrumb[]) => {
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

interface StructuredData {
  embedUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  contentUrl?: string;
  uploadDate?: string;
  copyrightHolder?: { '@type': string; name?: string }[];
  contributor?: { '@type': string; name?: string }[];
  license?: string;
  author?: {
    '@type': string;
    name?: string;
  }[];
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

const getStructuredDataFromArticle = (
  article: GQLArticle,
  breadcrumbItems: Breadcrumb[],
) => {
  if (!article) return [];

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

  const mediaElements: Mediaelements[] = [];

  const images = article.metaData?.images || [];
  images.forEach(image => {
    mediaElements.push({
      data: image,
      type: IMAGE_TYPE,
    });
  });

  const audios = article.metaData?.audios || [];
  audios.forEach(audio => {
    mediaElements.push({
      data: audio,
      type: AUDIO_TYPE,
    });
  });

  const videos = article.metaData?.brightcoves || [];

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

    structuredDataCollection.push(structuredData);
  });

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

    structuredDataCollection.push(structuredData);
  });

  return structuredDataCollection;
};

export default getStructuredDataFromArticle;
