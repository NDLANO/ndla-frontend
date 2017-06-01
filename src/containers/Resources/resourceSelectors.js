/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import defined from 'defined';
import {
  introductionI18N,
  titleI18N,
  descriptionI18N,
} from '../../util/i18nFieldFinder';
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

export const getResourcesByTopicId = topicId =>
  createSelector([getResources, getLocale], (all, locale) =>
    defined(all[topicId], []).map(resource => {
      const mappedResource = {
        ...resource,
        title: titleI18N(resource, locale, true),
        introduction: introductionI18N(resource, locale, true) ||
          descriptionI18N(resource, locale, true),
      };
      delete mappedResource.description;
      return mappedResource;
    }),
  );

export const getResourcesByTopicIdGroupedByResourceTypes = topicId =>
  createSelector([getResourcesByTopicId(topicId)], resourcesByTopic =>
    resourcesByTopic.reduce((obj, resource) => {
      const resourceTypesWithResources = resource.resourceTypes.map(type => {
        const existing = defined(obj[type.id], []);
        return { ...type, resources: [...existing, resource] };
      });
      const reduced = resourceTypesWithResources.reduce(
        (acc, type) => ({ ...acc, [type.id]: type.resources }),
        {},
      );
      return { ...obj, ...reduced };
    }, {}),
  );

export const getResourceTypesByTopicId = topicId =>
  createSelector(
    [getResourceTypes, getResourcesByTopicIdGroupedByResourceTypes(topicId)],
    (types, resourcesByResourceTypeId) =>
      types
        .map(type => {
          let subtypeResources = [];
          if (type.subtypes) {
            subtypeResources = type.subtypes.reduce(
              (acc, subtype) =>
                acc.concat(defined(resourcesByResourceTypeId[subtype.id], [])),
              [],
            );
          }
          const resources = defined(
            resourcesByResourceTypeId[type.id],
            [],
          ).concat(subtypeResources);
          return { ...type, resources };
        })
        .filter(type => type.resources.length > 0),
  );
