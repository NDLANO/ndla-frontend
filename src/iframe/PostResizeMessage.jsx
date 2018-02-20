/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';

class PostResizeMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 0,
    };
  }

  componentDidMount() {
    this.onResizeReady();
    window.addEventListener('resize', this.onResizeReady);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeReady);
  }

  onResizeReady = () => {
    if (document.readyState === 'complete') {
      this.sendResizeToParentWindow();
    } else {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          this.sendResizeToParentWindow();
        }
      };
    }
  };

  sendResizeToParentWindow = () => {
    const outerWidth =
      document && document.body
        ? document.body.getBoundingClientRect().width
        : 0;

    if (window.parent && this.state.width !== outerWidth) {
      this.setState({ width: outerWidth }, () =>
        window.parent.postMessage(
          {
            event: 'resize',
            height: document.body.scrollHeight,
          },
          '*',
        ),
      );
    }
  };

  render() {
    return null;
  }
}

export default PostResizeMessage;
