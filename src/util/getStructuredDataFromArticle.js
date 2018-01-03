/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';

const CREATIVE_WORK_TYPE = 'CreativeWork';
const PERSON_TYPE = 'Person';
const ORGANIZATION_TYPE = 'Organization';
const IMAGE_TYPE = 'ImageObject';
const VIDEO_TYPE = 'VideoObject';
const AUDIO_TYPE = 'AudioObject';

const getStructuredDataBase = () => ({
  '@context': 'http://schema.org',
});

const getCopyrightData = copyright => {
  const data = {
    license: copyright.license.url,
  };

  // can only be one since it is a person or a organization
  const author = copyright.creators[0];

  if (author) {
    data.author = {
      '@type': PERSON_TYPE,
      name: author.name,
    };
  }

  // can only be one since it is a person or a organization
  const copyrightHolder = copyright.rightsholders[0];

  if (copyrightHolder) {
    data.copyrightHolder = {
      '@type': ORGANIZATION_TYPE,
      name: copyrightHolder.name,
    };
  }

  // can only be one since it is a person or a organization
  const contributor = copyright.processors[0];

  if (contributor) {
    data.contributor = {
      '@type': PERSON_TYPE,
      name: contributor.name,
    };
  }

  return data;
};

const getStructuredDataFromArticle = article => {
  if (!article) return [];

  let articleData = getStructuredDataBase();
  articleData['@type'] = CREATIVE_WORK_TYPE;
  articleData.name = article.title;

  articleData = {
    ...articleData,
    ...getCopyrightData(article.copyright),
  };

  const structuredDataCollection = [articleData];

  const mediaElements = [];

  const images = defined(article.metaData.images, []);
  images.forEach(image => {
    mediaElements.push({
      data: image,
      type: IMAGE_TYPE,
    });
  });

  const audios = defined(article.metaData.audios, []);
  audios.forEach(audio => {
    mediaElements.push({
      data: audio,
      type: AUDIO_TYPE,
    });
  });

  const videos = defined(article.metaData.brightcoves, []);

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
    structuredData.name = data.title;

    if (type === VIDEO_TYPE) {
      structuredData.embedUrl = data.src;
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
