/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Document, Pencil, Path } from 'ndla-ui/icons';
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from '../constants';

const mapping = {
  [RESOURCE_TYPE_LEARNING_PATH]: {
    icon: <Path />,
    heroProps: {},
    resourceListClassName: 'c-resource-group--learingpath',
  },
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: {
    icon: <Document />,
    heroProps: { red: true },
    resourceListClassName: 'c-resource-group--subject-material',
  },
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: {
    icon: <Pencil />,
    heroProps: { green: true },
    resourceListClassName: 'c-resource-group--tasks-and-activities',
  },
  default: {
    icon: <Document />,
    heroProps: {},
    resourceListClassName: 'c-resource-group--subject-material',
  },
};

export default resourceTypes => {
  const resourceType = resourceTypes.find(type => mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};
