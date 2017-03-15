/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import defined from 'defined';
// import groupBy from 'lodash/groupBy';
// import { getArticle } from '../ArticlePage/articleSelectors';
import { introductionI18N, titleI18N, descriptionI18N } from '../../util/i18nFieldFinder';
import { getLocale } from '../Locale/localeSelectors';
import { isLearningPathResource, isArticleResource } from './resourceHelpers';


const getResourcesFromState = state => state.resources;

export const getResources = createSelector(
    [getResourcesFromState],
    resources => resources.all,
);

export const getResourcesByTopicId = topicId => createSelector(
    [getResources, getLocale],
    (all, locale) => defined(all[topicId], []).map((resource) => {
      const mappedResource = ({
        ...resource,
        title: titleI18N(resource, locale, true),
        introduction: introductionI18N(resource, locale, true) || descriptionI18N(resource, locale, true),
      });
      delete mappedResource.description;
      return mappedResource;
    }),
);


export const getArticleResourcesByTopicId = topicId => createSelector(
    [getResourcesByTopicId(topicId)],
    resources => resources.filter(isArticleResource).map(resource => ({ ...resource, icon: 'Document' })),
);

export const getLearningPathResourcesByTopicId = topicId => createSelector(
    [getResourcesByTopicId(topicId)],
    resources => resources.filter(isLearningPathResource).map(resource => ({ ...resource, icon: 'Path' })),
);
