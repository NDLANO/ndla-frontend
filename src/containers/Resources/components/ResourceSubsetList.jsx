/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'react-bem-helper';
// import SafeLink from 'ndla-ui/lib/common/SafeLink';
import ResourceList from './ResourceList';
import { ResourceShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-resource-subset',
  prefix: 'c-',
});

const ResourceSubsetList = ({ articleResources, learningPathResources, resourceToLinkProps }) => (
  <div {...classes()} >
    <h1 {...classes('header')}>Læringsstier {'\u2192'}</h1>
    <ResourceList resourceToLinkProps={resourceToLinkProps} resources={articleResources.slice(0, 2)} />
    <h1 {...classes('header')}>Fagstoff {'\u2192'}</h1>
    <ResourceList resourceToLinkProps={resourceToLinkProps} resources={learningPathResources.slice(0, 2)} />
  </div>
);

ResourceSubsetList.propTypes = {
  articleResources: PropTypes.arrayOf(ResourceShape).isRequired,
  learningPathResources: PropTypes.arrayOf(ResourceShape).isRequired,
  resourceToLinkProps: PropTypes.func.isRequired,
};

export default ResourceSubsetList;
