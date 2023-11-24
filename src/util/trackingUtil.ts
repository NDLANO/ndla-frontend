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
  GQLLearningpathStep,
  GQLMyNdlaPersonalDataFragmentFragment,
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
  '3': 'CustDimOverordnet',
  '4': 'CustDimInnholdstype',
  '5': 'CustDimFag',
  '6': 'CustDimHovedemne',
  '7': 'CustDimEmne',
  '8': 'CustDimFagartikkel',
  '9': 'CustDimForfatter',
  '10': 'CustDimKjerneelement',
  '13': 'CustDimStiLengde',
  '14': 'CustDimStiSteg',
  '16': 'CustDimFylke',
  '17': 'CustDimSkule',
  '18': 'CustDimRolle',
  '19': 'CustDimFilter',
  '20': 'CustDimKompetansemaal',
};

export const convertToGaOrGtmDimension = (
  dimensions: DimensionType,
): Record<string | number, any> => {
  return Object.keys(dimensions).reduce((prev, curr) => {
    const key = curr as DimensionKeys;
    return {
      ...prev,
      [getDimensionsCodes[key]]: dimensions[key],
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
  user?: GQLMyNdlaPersonalDataFragmentFragment;
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
    '8': isArticle && article ? article.title : undefined,
    '9': authors?.map((author) => author?.name).join(', '),
    '10': getGrepCodeOfType('KE', article?.grepCodes),
    '13': learningpath?.learningsteps?.length,
    '14': learningstep ? learningstep.seqNo + 1 : undefined,
    '16': user ? user.organization : undefined,
    '17': user
      ? user.groups.find((g) => g.isPrimarySchool)?.displayName
      : undefined,
    '18': user ? user.username : undefined,
    '19': filter,
    '20': getGrepCodeOfType('KM', article?.grepCodes),
  };

  return convertToGaOrGtmDimension(dimensions);
};
