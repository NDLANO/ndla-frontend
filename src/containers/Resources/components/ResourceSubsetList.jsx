/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'react-bem-helper';
import SafeLink from 'ndla-ui/lib/common/SafeLink';
import ResourceList from './ResourceList';
import { ResourceShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-resource-subset',
  prefix: 'c-',
});

const ResourceSubsetList = ({ resourceGroups, toResourceTab, resourceToLinkProps }) => (
  <div {...classes()} >
    {resourceGroups.map((group, i) => (
      <div key={i}>
        <h1 {...classes('header')}>{group.title} {'\u2192'}</h1>
        <ResourceList resourceToLinkProps={resourceToLinkProps} resources={group.resources.slice(0, 2)} />
        <SafeLink {...classes('all-link')} to={toResourceTab(i)}>{group.viewAllLinkTitle}</SafeLink>
      </div>
    ))}
  </div>
);

ResourceSubsetList.propTypes = {
  resourceToLinkProps: PropTypes.func.isRequired,
  toResourceTab: PropTypes.func.isRequired,
  resourceGroups: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    viewAllLinkTitle: PropTypes.string.isRequired,
    resources: PropTypes.arrayOf(ResourceShape).isRequired,
  })),
};

export default ResourceSubsetList;
