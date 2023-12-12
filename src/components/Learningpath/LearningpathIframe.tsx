/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export const urlIsNDLAApiUrl = (url: string) =>
  /^(http|https):\/\/(ndla-frontend|www).([a-zA-Z]+.)?api.ndla.no/.test(url);
export const urlIsNDLAEnvUrl = (url: string) =>
  /^(http|https):\/\/(www.)?([a-zA-Z]+.)?ndla.no/.test(url);
export const urlIsLocalNdla = (url: string) =>
  /^http:\/\/(proxy.ndla-local|localhost):30017/.test(url);
export const urlIsNDLAUrl = (url: string) =>
  urlIsNDLAApiUrl(url) || urlIsNDLAEnvUrl(url) || urlIsLocalNdla(url);

interface Props {
  html: string;
  url: string;
}

const LearningpathIframe = ({ html, url }: Props) => {
  const iframeRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [listeningToMessages, setListeningToMessages] = useState(true);

  const handleIframeResizing = (url: string) => {
    if (urlIsNDLAUrl(url)) {
      enableIframeMessageListener();
    } else {
      disableIframeMessageListener();
    }
  };

  useEffect(() => {
    handleIframeResizing(url);
  });

  const getIframeDOM = () => {
    return iframeRef.current?.children[0] as HTMLIFrameElement;
  };

  const enableIframeMessageListener = () => {
    window.addEventListener('message', handleIframeMessages);
    setListeningToMessages(true);
  };

  const disableIframeMessageListener = () => {
    window.removeEventListener('message', handleIframeMessages);
    setListeningToMessages(false);
  };

  const handleScrollTo = (evt: MessageEvent) => {
    const iframe = getIframeDOM();
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const top = evt.data.top + rect.top + scrollTop;
      window.scroll({ top });
    }
  };

  const handleResize = (evt: MessageEvent) => {
    if (!evt.data.height) {
      return;
    }
    const iframe = getIframeDOM();
    if (iframe) {
      const newHeight = parseInt(evt.data.height, 10);
      iframe.style.height = `${newHeight}px`; // eslint-disable-line no-param-reassign
    }
  };

  const handleIframeMessages = (event: MessageEvent) => {
    const iframe = getIframeDOM();
    /* Needed to enforce content to stay within iframe on Safari iOS */
    if (iframe) {
      iframe.setAttribute('scrolling', 'no');
    }

    if (!listeningToMessages || !event || !event.data) {
      return;
    }

    switch (event.data.event) {
      case 'resize':
        handleResize(event);
        break;
      case 'scrollTo':
        handleScrollTo(event);
        break;
      default:
        break;
    }
  };

  return <div ref={iframeRef}>{parse(html)}</div>;
};

export default LearningpathIframe;
