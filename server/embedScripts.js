import { addEventListenerForResize, updateIFrameDimensions, addAsideClickListener } from '../src/util/articleScripts';

const parentPostMessage = (evt) => {
  const data = { context: 'ndla-oembed', height: document.getElementsByTagName('body')[0].offsetHeight };
  parent.postMessage(data, evt.target.referrer);
};

window.onload = (evt) => {
  parentPostMessage(evt);
  addEventListenerForResize();
  updateIFrameDimensions();
  addAsideClickListener();
};
