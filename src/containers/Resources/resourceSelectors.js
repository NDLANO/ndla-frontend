/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import defined from 'defined';
import { introductionI18N, titleI18N, descriptionI18N } from '../../util/i18nFieldFinder';
import { getLocale } from '../Locale/localeSelectors';


const getResourcesFromState = state => state.resources;

export const getResources = createSelector(
    [getResourcesFromState],
    resources => resources.all,
);

export const getResourceTypes = createSelector(
    [getResourcesFromState],
    resources => resources.types,
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


export const getResourceTypesByTopicId = topicId => createSelector(
    [getResourceTypes, getResourcesByTopicId(topicId), getLocale],
    (types, resources) => {
      const resourcesByResourceTypeId = resources.reduce((obj, resource) => {
        const resourceTypesWithResources = resource.resourceTypes.map((type) => {
          const existing = defined(obj[type.id], []);
          return { ...type, resources: [...existing, resource] };
        });
        const reduced = resourceTypesWithResources.reduce((acc, type) => ({ ...acc, [type.id]: type.resources }), {});
        return ({ ...obj, ...reduced });
      }, {});


      return types.map((type) => {
        if (type.subTypes) {
          return {
            ...type,
            subtypes: type.subTypes.map(subtype => ({ ...subtype, resources: resourcesByResourceTypeId[subtype.id] })),
            resources: resourcesByResourceTypeId[type.id],
          };
        }
        return { ...type, resources: resourcesByResourceTypeId[type.id] };
      });
    },
);
