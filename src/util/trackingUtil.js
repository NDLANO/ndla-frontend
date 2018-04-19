/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getDimensionsCodes = {
  3: {
    ga: 'dimension3',
    gtm: 'CustDimOverordnet',
  },
  4: {
    ga: 'dimension4',
    gtm: 'CustDimInnholdstype',
  },
  5: {
    ga: 'dimension5',
    gtm: 'CustDimFag',
  },
  6: {
    ga: 'dimension6',
    gtm: 'CustDimHovedemne',
  },
  7: {
    ga: 'dimension7',
    gtm: 'CustDimEmne',
  },
  8: {
    ga: 'dimension8',
    gtm: 'CustDimFagartikkel',
  },
  9: {
    ga: 'dimension9',
    gtm: 'CustDimForfatter',
  },
};

export const convertToGaOrGtmDimension = (dimensions, type) => {
  const newDimensions = {};
  Object.keys(dimensions).forEach(key => {
    Object.assign(newDimensions, {
      [getDimensionsCodes[key][type]]: dimensions[key],
    });
  });
  return newDimensions;
};

const getCopyrightFieldWithFallBack = (article, field, fallback) =>
  article && article.copyright && article.copyright[field]
    ? article.copyright[field]
    : fallback;

export const getAllDimensions = (
  props,
  contentTypeLabel,
  isArticle = false,
) => {
  const { article, subject, topicPath } = props;
  const rightsholders = getCopyrightFieldWithFallBack(
    article,
    'rightsholders',
    undefined,
  );
  const authors = getCopyrightFieldWithFallBack(
    article,
    'creators',
    rightsholders,
  );

  const dimensions = {
    4: contentTypeLabel,
    5: subject ? subject.name : undefined,
    6: topicPath && topicPath[0] ? topicPath[0].name : undefined,
    7: topicPath && topicPath[1] ? topicPath[1].name : undefined,
    8: isArticle && article ? article.title : undefined,
    9: authors ? authors.map(author => author.name).join(', ') : undefined,
  };

  return {
    ga: convertToGaOrGtmDimension(dimensions, 'ga'),
    gtm: convertToGaOrGtmDimension(dimensions, 'gtm'),
  };
};
