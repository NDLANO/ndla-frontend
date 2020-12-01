/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import format from 'date-fns/format';

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

const getCopyrightData = ({ creators, rightsholders, license, processors }) => {
  const data = {
    license: license.url,
  };

  const author = creators?.map(c => {
    return {
      '@type': PERSON_TYPE,
      name: c.name,
    }
  })
  if(author?.length > 0) {
    data.author = author;
  }

  const copyrightHolder = rightsholders?.map(r => {
    return {
      '@type': ORGANIZATION_TYPE,
      name: r.name,
    }
  })
  if(copyrightHolder?.length > 0) {
    data.copyrightHolder = copyrightHolder;
  }

  const contributor = processors?.map(c => {
    return {
      '@type': PERSON_TYPE,
      name: c.name,
    }
  })
  if(contributor?.length > 0) {
    data.contributor = contributor;
  }

  return data;
};

const getPublisher = () => {
  const data = {}
  data.publisher = {
    '@type': ORGANIZATION_TYPE,
    '@id': 'https://ndla.no',
    name: 'NDLA',
  }
  return data;
}

const getBreadcrumbs = breadcrumbItems => {
  if (!breadcrumbItems) {
    return [];
  }
  const items = breadcrumbItems.map((item, index) => {
    return {
      '@type': ITEM_TYPE,
      name: item.name,
      position: index + 1,
      item: {
        '@type': THING_TYPE,
        id: `${config.ndlaFrontendDomain}${item.to}`,
      },
    };
  });

  let data = getStructuredDataBase();
  data['@type'] = BREADCRUMB_TYPE;
  data.numberOfItems = breadcrumbItems.length;
  data.itemListELement = items;

  return data;
};

const getStructuredDataFromArticle = (article, breadcrumbItems) => {
  if (!article) return [];

  let articleData = getStructuredDataBase();
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

  const breadcrumbs = breadcrumbItems
    ? getBreadcrumbs(breadcrumbItems)
    : undefined;
  if (breadcrumbs) {
    structuredDataCollection.push(breadcrumbs);
  }

  const mediaElements = [];

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

  videos.forEach(video => {
    mediaElements.push({
      data: video,
      type: VIDEO_TYPE,
    });
  });

  mediaElements.forEach(media => {
    const { data, type } = media;

    let structuredData = getStructuredDataBase();
    structuredData['@type'] = type;
    structuredData['@id'] = data.src;
    structuredData.name = data.title;

    if (type === VIDEO_TYPE) {
      structuredData.embedUrl = data.src;
      structuredData.thumbnailUrl = data.cover;
      structuredData.description = data.description;
      structuredData.contentUrl = data.download;
      structuredData.uploadDate = format(data.uploadDate, 'YYYY-MM-DD');
    } else {
      structuredData.contentUrl = data.src;
    }

    structuredData = {
      ...structuredData,
      ...getCopyrightData(data.copyright),
    };

    structuredDataCollection.push(structuredData);
  });

  return structuredDataCollection;
};

export default getStructuredDataFromArticle;
