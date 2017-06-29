/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { Document, Pencil, Path } from 'ndla-ui/icons';

const mapping = {
  'urn:resource-type:learning-path': {
    icon: <Path />,
    heroProps: {},
  },
  'urn:resource-type:subject-matter': {
    icon: <Document />,
    heroProps: { red: true },
  },
  'urn:resource-type:assignment': {
    icon: <Pencil />,
    heroProps: {},
  },
  default: {
    icon: <Document />,
    heroProps: { green: true },
  },
};

export default resourceTypes => {
  const resourceType = resourceTypes.find(type => mapping[type.id]);
  if (resourceType) {
    return mapping[resourceType.id];
  }
  return mapping.default;
};
