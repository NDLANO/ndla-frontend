/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  GQLArticle,
  GQLSubject,
  GQLTopic,
  GQLLearningpath,
  GQLLearningpathStep,
} from '../graphqlTypes';

type DimensionKeys =
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '13'
  | '14'
  | '19'
  | '20';
type DimensionType = Record<DimensionKeys, string | number | undefined>;

export const getDimensionsCodes = {
  '3': {
    ga: 'dimension3',
    gtm: 'CustDimOverordnet',
  },
  '4': {
    ga: 'dimension4',
    gtm: 'CustDimInnholdstype',
  },
  '5': {
    ga: 'dimension5',
    gtm: 'CustDimFag',
  },
  '6': {
    ga: 'dimension6',
    gtm: 'CustDimHovedemne',
  },
  '7': {
    ga: 'dimension7',
    gtm: 'CustDimEmne',
  },
  '8': {
    ga: 'dimension8',
    gtm: 'CustDimFagartikkel',
  },
  '9': {
    ga: 'dimension9',
    gtm: 'CustDimForfatter',
  },
  '10': {
    ga: 'dimension10',
    gtm: 'CustDimKjerneelement',
  },
  '13': {
    ga: 'dimension13',
    gtm: 'CustDimStiLengde',
  },
  '14': {
    ga: 'dimension14',
    gtm: 'CustDimStiSteg',
  },
  '19': {
    ga: 'dimension19',
    gtm: 'CustDimFilter',
  },
  '20': {
    ga: 'dimension20',
    gtm: 'CustDimKompetansemaal',
  },
};

export const convertToGaOrGtmDimension = (
  dimensions: DimensionType,
  type: 'ga' | 'gtm',
) => {
  const newDimensions = {};
  Object.keys(dimensions).forEach(key => {
    Object.assign(newDimensions, {
      [getDimensionsCodes[key as DimensionKeys][type]]:
        dimensions[key as DimensionKeys],
    });
  });
};

const getGrepCodeOfType = (pattern: string, article?: GQLArticle) =>
  article?.grepCodes?.filter(code => code?.startsWith(pattern))?.join('|') ||
  undefined;

interface Props {
  article?: GQLArticle;
  subject?: GQLSubject;
  topicPath?: (GQLTopic | undefined)[];
  learningpath?: GQLLearningpath;
  relevance?: string;
  learningstep?: GQLLearningpathStep;
  filter?: string;
}

export const getAllDimensions = (
  props: Props,
  contentTypeLabel?: string,
  isArticle: boolean = false,
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
  const rightsholders = article?.copyright.rightsholders;
  const authors = article?.copyright.creators || rightsholders;

  const dimensions: DimensionType = {
    '3': relevance,
    '4': contentTypeLabel,
    '5': subject?.name,
    '6': topicPath?.[0]?.name,
    '7':
      topicPath && topicPath[1]
        ? topicPath[topicPath.length - 1]?.name
        : undefined,
    '8': isArticle && article ? article.title : undefined,
    '9': authors?.map(author => author?.name).join(', '),
    '10': getGrepCodeOfType('KE', article),
    '13': learningpath?.learningsteps?.length,
    '14': learningstep ? learningstep.seqNo + 1 : undefined,
    '19': filter,
    '20': getGrepCodeOfType('KM', article),
  };

  return {
    ga: convertToGaOrGtmDimension(dimensions, 'ga'),
    gtm: convertToGaOrGtmDimension(dimensions, 'gtm'),
  };
};
