/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Link from 'react-router-dom/Link';
import { Button } from 'ndla-ui';
import { ResourceShape } from '../../shapes';
// import { Path, Document, Pencil, Additional } from '../icons';

const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

const Resource = ({ resource, resourceToLinkProps, isHidden }) => {
  const linkProps = resourceToLinkProps(resource);

  return (
    <li
      {...classes('item', {
        'o-flag  o-flag--top': true,
        hidden: isHidden,
      })}>
      <div {...classes('icon o-flag__img')}>
        {resource.icon}
      </div>
      <div {...classes('body o-flag__body')}>
        <h1 {...classes('title')}>
          {linkProps.href
            ? <a {...linkProps}>
                {resource.name}
              </a>
            : <Link {...resourceToLinkProps(resource)}>
                {resource.name}
              </Link>}
        </h1>
      </div>
    </li>
  );
};

Resource.propTypes = {
  isHidden: PropTypes.bool.isRequired,
  resource: ResourceShape.isRequired,
  resourceToLinkProps: PropTypes.func.isRequired,
};

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = { showAll: false, secondary: false };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ showAll: !this.state.showAll });
  }

  render() {
    // NB! Always have hidden resources in the DOM so that they can be indexed by search enignes.
    const { resources, type, ...rest } = this.props;
    const limit = 8;
    const { showAll } = this.state;
    return (
      <div>
        <ul {...classes('list')}>
          {resources.map((resource, index) =>
            <Resource
              key={resource.id}
              type={type}
              {...rest}
              resource={resource}
              isHidden={!(showAll || index < limit)}
            />,
          )}
        </ul>
        {resources.length > limit
          ? <div {...classes('button-wrapper')}>
              <Button
                {...classes('button', '', 'c-btn c-button--outline')}
                onClick={this.handleClick}>
                {showAll ? 'Vis mindre' : 'Vis mer'}
              </Button>
            </div>
          : null}
      </div>
    );
  }
}

ResourceList.propTypes = {
  resources: PropTypes.arrayOf(ResourceShape).isRequired,
  type: PropTypes.string,
  secondary: PropTypes.bool,
  onChange: PropTypes.func,
  resourceToLinkProps: PropTypes.func.isRequired,
};

export default ResourceList;
