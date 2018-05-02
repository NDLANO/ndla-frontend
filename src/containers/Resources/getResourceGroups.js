import defined from 'defined';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
} from '../../constants';

export const sortOrder = {
  [RESOURCE_TYPE_LEARNING_PATH]: 1,
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: 2,
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: 3,
  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: 4,
  [RESOURCE_TYPE_SOURCE_MATERIAL]: 5,
  [RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES]: 6,
};

export const groupeResourcesByResourceTypes = (
  resourceTypes,
  supplementaryResources,
  coreResouces,
) => {
  const resources = [
    ...coreResouces,
    ...supplementaryResources.map(resource => ({
      ...resource,
      additional: true,
    })),
  ];
  return resources.reduce((obj, resource) => {
    const resourceTypesWithResources = resource.resourceTypes.map(type => {
      const existing = defined(obj[type.id], []);
      return { ...type, resources: [...existing, resource] };
    });
    const reduced = resourceTypesWithResources.reduce(
      (acc, type) => ({ ...acc, [type.id]: type.resources }),
      {},
    );
    return { ...obj, ...reduced };
  }, {});
};

export const sortResourceTypes = resourceTypes =>
  [...resourceTypes].sort((a, b) => {
    if (sortOrder[a.id] === undefined && sortOrder[b.id] === undefined)
      return 0;
    if (sortOrder[a.id] === undefined) return 1;
    if (sortOrder[b.id] === undefined) return -1;
    if (sortOrder[a.id] > sortOrder[b.id]) return 1;
    if (sortOrder[a.id] < sortOrder[b.id]) return -1;
    return 0;
  });

export const getResourceGroups = (
  resourceTypes,
  supplementaryResources,
  coreResouces,
) => {
  const groupedResources = groupeResourcesByResourceTypes(
    resourceTypes,
    supplementaryResources,
    coreResouces,
  );
  const sortedResourceTypes = sortResourceTypes(resourceTypes);

  return sortedResourceTypes
    .map(type => {
      const resources = defined(groupedResources[type.id], []);
      return { ...type, resources };
    })
    .filter(type => type.resources.length > 0);
};
