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
      height: 0,
    };
  }

  async componentDidMount() {
    this.onWatchHeight();
    this.onResizeReady();
    window.addEventListener('resize', this.onResizeReady);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeReady);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
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

  onWatchHeight = () => {
    this.intervalId = setInterval(() => {
      const container = document.querySelector('.c-article--iframe');
      const height = container ? container.scrollHeight + 35 : 0;
      if (this.state.height !== height) {
        this.resizer();
      }
    }, 100);
  };

  sendResizeToParentWindow = () => {
    const outerWidth =
      document && document.body
        ? document.body.getBoundingClientRect().width
        : 0;
    if (window.parent && this.state.width !== outerWidth) {
      this.resizer(outerWidth);
    }
  };

  resizer = (width = undefined) => {
    const container = document.querySelector('.c-article--iframe');
    const height = container ? container.scrollHeight + 35 : 0;
    const newState = width !== undefined ? { width, height } : { height };
    this.setState(newState, () =>
      window.parent.postMessage(
        {
          event: 'resize',
          height,
        },
        '*',
      ),
    );
  };

  render() {
    return null;
  }
}

export default PostResizeMessage;
