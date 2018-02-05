import React from 'react';

class PostResizeMessage extends React.Component {
  componentDidMount() {
    this.sendResizeToParentWindow();

    window.addEventListener('resize', this.sendResizeToParentWindow);
  }

  sendResizeToParentWindow = () => {
    if (window.parent !== undefined) {
      window.parent.postMessage(
        {
          event: 'resize',
          height: document.body.scrollHeight,
        },
        '*',
      );
    }
  };

  render() {
    return null;
  }
}

export default PostResizeMessage;
