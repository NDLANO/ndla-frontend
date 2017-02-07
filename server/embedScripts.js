import { addEventListenerForResize, updateIFrameDimensions, addAsideClickListener } from '../src/util/articleScripts';

const parentPostMessage = () => {
  if (parent.postMessage) {
    const data = { context: 'ndla-oembed', height: document.getElementsByTagName('body')[0].offsetHeight };
    parent.postMessage(data, '*');
  }
};

window.onload = () => {
  parentPostMessage();
  addEventListenerForResize();
  updateIFrameDimensions();
  addAsideClickListener();
};
