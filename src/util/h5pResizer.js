// ES2015ified version of  H5P iframe Resizer
// See  for src and additonal comments https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js
(function iife() {
  if (__SERVER__) {
    return;
  }

  if (
    !window.postMessage ||
    !window.addEventListener ||
    window.h5pResizerInitialized
  ) {
    return; // Not supported
  }

  window.h5pResizerInitialized = true;

  // Map actions to handlers
  const actionHandlers = {};

  /**
   * Prepare iframe resize.
   */
  actionHandlers.hello = (iframe, data, respond) => {
    // Make iframe responsive
    iframe.style.width = '100%'; // eslint-disable-line no-param-reassign

    // Tell iframe that it needs to resize when our window resizes
    const resize = () => {
      if (iframe.contentWindow) {
        // Limit resize calls to avoid flickering
        respond('resize');
      } else {
        // Frame is gone, unregister.
        window.removeEventListener('resize', resize);
      }
    };
    window.addEventListener('resize', resize, false);

    // Respond to let the iframe know we can resize it
    respond('hello');
  };

  /**
   * Prepare iframe resize.
   */
  actionHandlers.prepareResize = (iframe, data, respond) => {
    // Do not resize unless page and scrolling differs
    if (
      iframe.clientHeight !== data.scrollHeight ||
      data.scrollHeight !== data.clientHeight
    ) {
      // Reset iframe height, in case content has shrinked.
      iframe.style.height = `${data.clientHeight}px`; // eslint-disable-line no-param-reassign
      respond('resizePrepared');
    }
  };

  /**
   * Resize parent and iframe to desired height.
   */
  actionHandlers.resize = (iframe, data) => {
    iframe.style.height = `${data.scrollHeight}px`; // eslint-disable-line no-param-reassign
  };

  // Listen for messages from iframes
  window.addEventListener(
    'message',
    event => {
      if (event.data.context !== 'h5p') {
        return; // Only handle h5p requests.
      }

      // Find out who sent the message
      let iframe;
      const iframes = document.getElementsByTagName('iframe');
      for (let i = 0; i < iframes.length; i += 1) {
        if (iframes[i].contentWindow === event.source) {
          iframe = iframes[i];
          break;
        }
      }

      if (!iframe) {
        return; // Cannot find sender
      }

      // Find action handler handler
      if (actionHandlers[event.data.action]) {
        actionHandlers[
          event.data.action
        ](iframe, event.data, (action, data = {}) => {
          const payload = Object.assign({}, data, { action, context: 'h5p' });
          event.source.postMessage(payload, event.origin);
        });
      }
    },
    false,
  );

  // Let h5p iframes know we're ready!
  const iframes = document.getElementsByTagName('iframe');
  const ready = {
    context: 'h5p',
    action: 'ready',
  };
  for (let i = 0; i < iframes.length; i += 1) {
    if (iframes[i].src.indexOf('h5p') !== -1) {
      iframes[i].contentWindow.postMessage(ready, '*');
    }
  }
})();
