import { initArticleScripts } from 'ndla-article-scripts';

const parentPostMessage = () => {
  if (window.parent.postMessage) {
    const data = {
      context: 'ndla-oembed',
      height: document.getElementsByTagName('body')[0].offsetHeight,
    };
    window.parent.postMessage(data, '*');
  }
};

window.onload = () => {
  parentPostMessage();
  initArticleScripts();
};
