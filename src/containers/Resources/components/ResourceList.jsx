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
import { ResourceShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

const Resource = ({ resource, resourceToLinkProps }) => (
  <li {...classes('item')}>
    <div {...classes('text-container')}>
      <SafeLink {...resourceToLinkProps(resource)}>
        <h1 {...classes('header')}>{resource.name}</h1>
      </SafeLink>
      {resource.introduction ? <p>{resource.introduction}</p> : null}
    </div>
    {resource.coverPhotoUrl ?
      <div {...classes('img-container')}>
        <img role="presentation" src={`${resource.coverPhotoUrl}?width=380`} />
      </div> : null
    }
  </li>
);

Resource.propTypes = {
  resource: ResourceShape.isRequired,
  resourceToLinkProps: PropTypes.func.isRequired,
};

const ResourceList = ({ resources, ...rest }) => (
  <ul {...classes('list')} >
    { resources.map(resource => <Resource key={resource.id} {...rest} resource={resource} />)}
  </ul>
);

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
  resourceToLinkProps: PropTypes.func.isRequired,
};

export default ResourceList;
