/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Document, Pencil, Path } from 'ndla-ui/icons';

const mapping = {
  'urn:resourcetype:learningPath': {
    icon: <Path />,
    heroProps: {},
    resourceListClassName:
      'c-resource-group--urn-resource-type-0368610f-19bf-4a6f-86fa-9e6ea8876511',
  },
  'urn:resourcetype:subjectMaterial': {
    icon: <Document />,
    heroProps: { red: true },
    resourceListClassName:
      'c-resource-group--urn-resource-type-6c0bd4b9-23cb-43bf-affa-557e673d2c73',
  },
  'urn:resource-type:article': {
    icon: <Document />,
    heroProps: { red: true },
    resourceListClassName:
      'c-resource-group--urn-resource-type-6c0bd4b9-23cb-43bf-affa-557e673d2c73',
  },
  'urn:resourcetype:tasksAndActivities': {
    icon: <Pencil />,
    heroProps: { green: true },
    resourceListClassName:
      'c-resource-group--urn-resource-type-622364e0-8cea-4083-9ce1-74e33e14e0b4',
  },
  default: {
    icon: <Document />,
    heroProps: {},
  },
};

export default resourceTypes => {
  const resourceType = resourceTypes.find(type => mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};
