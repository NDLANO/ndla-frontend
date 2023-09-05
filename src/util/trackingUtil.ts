/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FeideUserApiType } from '@ndla/ui';
import {
  GQLArticle,
  GQLSubject,
  GQLTopic,
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
  | '16'
  | '17'
  | '18'
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
  '16': {
    ga: 'dimension16',
    gtm: 'CustDimFylke',
  },
  '17': {
    ga: 'dimension17',
    gtm: 'CustDimSkule',
  },
  '18': {
    ga: 'dimension18',
    gtm: 'CustDimRolle',
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
  return Object.keys(dimensions).reduce((prev, curr) => {
    const key = curr as DimensionKeys;
    return {
      ...prev,
      [getDimensionsCodes[key][type]]: dimensions[key],
    };
  }, {});
};

const getGrepCodeOfType = (pattern: string, grepCodes?: string[]) =>
  grepCodes?.filter((code) => code?.startsWith(pattern))?.join('|') ||
  undefined;

type RequiredLearningpath = {
  learningsteps?: any[];
};

interface Props {
  article?: Pick<GQLArticle, 'title' | 'grepCodes' | 'copyright'>;
  subject?: Pick<GQLSubject, 'name'>;
  topicPath?: (Pick<GQLTopic, 'name'> | undefined)[];
  learningpath?: RequiredLearningpath;
  relevance?: string;
  learningstep?: Pick<GQLLearningpathStep, 'seqNo'>;
  filter?: string;
  user?: FeideUserApiType;
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
    user,
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
    '8': isArticle && article ? article.title.title : undefined,
    '9': authors?.map((author) => author?.name).join(', '),
    '10': getGrepCodeOfType('KE', article?.grepCodes),
    '13': learningpath?.learningsteps?.length,
    '14': learningstep ? learningstep.seqNo + 1 : undefined,
    '16': user ? user.baseOrg?.displayName : undefined,
    '17': user ? user.primarySchool?.displayName : undefined,
    '18': user ? user.eduPersonPrimaryAffiliation : undefined,
    '19': filter,
    '20': getGrepCodeOfType('KM', article?.grepCodes),
  };

  return {
    ga: convertToGaOrGtmDimension(dimensions, 'ga'),
    gtm: convertToGaOrGtmDimension(dimensions, 'gtm'),
  };
};
