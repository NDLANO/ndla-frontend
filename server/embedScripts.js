import {
  addEventListenerForResize,
  updateIFrameDimensions,
  addAsideClickListener,
} from 'ndla-article-scripts';

const parentPostMessage = () => {
  if (parent.postMessage) {
    const data = {
      context: 'ndla-oembed',
      height: document.getElementsByTagName('body')[0].offsetHeight,
    };
    parent.postMessage(data, '*');
  }
};

window.onload = () => {
  parentPostMessage();
  addEventListenerForResize();
  updateIFrameDimensions();
  addAsideClickListener();
};
