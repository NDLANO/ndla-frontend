/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Redirect from 'react-router-dom/Redirect';

/**
 * The react-router Redirect component does'nt work with external
 * urls client side. So we use this helper component to handle it
 * for us.
 */
class RedirectExternal extends Component {
  componentDidMount() {
    window.location.replace(this.props.to);
  }

  render() {
    // Redirect component works with external urls serverside
    if (process.env.BUILD_TARGET === 'SERVER') {
      return <Redirect to={this.props.to} />;
    }
    return null;
  }
}

RedirectExternal.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
};

export default RedirectExternal;
