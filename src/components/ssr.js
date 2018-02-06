/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getComponentName } from 'ndla-util';
import hoistNonReactStatics from 'hoist-non-react-statics';

export const ssr = BaseComponent => {
  class WrappedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = { data: props.initialProps };
      this.refetch = this.refetch.bind(this);
    }

    async refetch() {
      if (BaseComponent.getInitialProps) {
        const props = await BaseComponent.getInitialProps(this.props);
        this.setState({ data: props });
      }
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          {...this.state.data}
          refetch={this.refetch}
        />
      );
    }
  }

  WrappedComponent.propTypes = {
    initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  };
  WrappedComponent.displayName = `ssr(${getComponentName(BaseComponent)})`;

  return hoistNonReactStatics(WrappedComponent, BaseComponent);
};

export default ssr;
