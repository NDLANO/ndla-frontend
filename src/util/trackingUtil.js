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
  10: {
    ga: 'dimension10',
    gtm: 'CustDimKjerneelement',
  },
  13: {
    ga: 'dimension13',
    gtm: 'CustDimStiLengde',
  },
  14: {
    ga: 'dimension14',
    gtm: 'CustDimStiSteg',
  },
  19: {
    ga: 'dimension19',
    gtm: 'CustDimFilter',
  },
  20: {
    ga: 'dimension20',
    gtm: 'CustDimKompetansemaal',
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

const getGrepCodeOfType = (article, pattern) =>
  article?.grepCodes?.filter(code => code.startsWith(pattern))?.join('|') ||
  undefined;

export const getAllDimensions = (
  props,
  contentTypeLabel,
  isArticle = false,
) => {
  const {
    article,
    relevance,
    subject,
    topicPath,
    learningpath,
    learningstep,
    filter,
  } = props;
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
    3: relevance ? relevance : undefined,
    4: contentTypeLabel,
    5: subject ? subject.name : undefined,
    6: topicPath?.[0]?.name || undefined,
    7:
      topicPath && topicPath[1]
        ? topicPath[topicPath.length - 1].name
        : undefined,
    8: isArticle && article ? article.title : undefined,
    9: authors ? authors.map(author => author.name).join(', ') : undefined,
    10: getGrepCodeOfType(article, 'KE'),
    13: learningpath ? learningpath.learningsteps.length : undefined,
    14: learningstep ? learningstep.seqNo + 1 : undefined,
    19: filter ? filter : undefined,
    20: getGrepCodeOfType(article, 'KM'),
  };

  return {
    ga: convertToGaOrGtmDimension(dimensions, 'ga'),
    gtm: convertToGaOrGtmDimension(dimensions, 'gtm'),
  };
};
