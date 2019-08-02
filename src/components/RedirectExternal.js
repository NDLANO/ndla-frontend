/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
/**
 * The react-router Redirect component does'nt work with external
 * urls. So we use this helper component to handle it for us.
 */
class RedirectExternal extends Component {
  constructor(props, context) {
    super(props, context);
    const { staticContext } = this.props;
    if (this.isStatic()) {
      // Update static context serverside (see https://github.com/NDLANO/ndla-frontend/blob/master/src/server/helpers/render.js#L49)
      staticContext.action = 'REPLACE';
      staticContext.location = props.to;
      staticContext.url = props.to;
    }
  }

  componentDidMount() {
    // Probably clientside. Just use window.location.replace
    if (!this.isStatic()) {
      window.location.replace(this.props.to);
    }
  }

  // Checks if we are using StaticRouter (i.e. serverside)
  isStatic() {
    return !!this.props.staticContext;
  }

  render() {
    return null;
  }
}

RedirectExternal.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  staticContext: PropTypes.shape({
    action: PropTypes.string,
    location: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default withRouter(RedirectExternal);
