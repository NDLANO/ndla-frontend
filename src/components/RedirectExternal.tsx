/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ContextType } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';
/**
 * The react-router Redirect component does'nt work with external
 * urls. So we use this helper component to handle it for us.
 */

interface RedirectStaticContext extends StaticContext {
  action: string;
  location: string;
  url: string;
}
interface Props extends RouteComponentProps<{}, RedirectStaticContext> {
  to: string;
}
class RedirectExternal extends Component<Props> {
  constructor(props: Props, context: ContextType<any>) {
    super(props, context);
    if (!!this.props.staticContext) {
      const { staticContext } = this.props;
      // Update static context serverside (see https://github.com/NDLANO/ndla-frontend/blob/master/src/server/helpers/render.js#L49)
      staticContext.action = 'REPLACE';
      staticContext.location = props.to;
      staticContext.url = props.to;
    }
  }

  componentDidMount() {
    // Probably clientside. Just use window.location.replace
    if (!!!this.props.staticContext) {
      window.location.replace(this.props.to);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(RedirectExternal);
