import React from 'react';

class PostResizeMessage extends React.Component {
  constructor() {
    super();
    this.state = {
      width: 0,
    };
  }
  componentDidMount() {
    this.sendResizeToParentWindow();
    window.addEventListener('resize', this.sendResizeToParentWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.sendResizeToParentWindow);
  }

  sendResizeToParentWindow = () => {
    if (window.parent !== undefined && this.state.width !== window.outerWidth) {
      this.setState({ width: window.outerWidth }, () =>
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
