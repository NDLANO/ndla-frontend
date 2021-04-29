/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import get from 'lodash/get';
import parse from 'html-react-parser';

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

interface State {
  listeningToMessages: boolean;
}

export default class LearningpathIframe extends React.Component<Props, State> {
  private _iframeDiv: HTMLDivElement | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      listeningToMessages: false,
    };

    this.handleIframeMessages = this.handleIframeMessages.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScrollTo = this.handleScrollTo.bind(this);
  }

  componentDidMount() {
    this.handleIframeResizing(this.props.url);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.url !== prevProps.url) {
      this.handleIframeResizing(this.props.url);
    }
  }

  componentWillUnmount() {
    this.disableIframeMessageListener();
  }

  getIframeDOM(): HTMLIFrameElement {
    return this._iframeDiv?.children[0] as HTMLIFrameElement;
  }

  handleIframeResizing(url: string) {
    if (urlIsNDLAUrl(url)) {
      this.setState(this.enableIframeMessageListener);
    } else {
      this.setState(this.disableIframeMessageListener);
    }
  }

  enableIframeMessageListener() {
    if (!this.state.listeningToMessages) {
      window.addEventListener('message', this.handleIframeMessages);
      this.setState({ listeningToMessages: true });
    }
  }

  disableIframeMessageListener() {
    window.removeEventListener('message', this.handleIframeMessages);
    this.setState({ listeningToMessages: false });
  }

  handleScrollTo(evt: MessageEvent) {
    const iframe = this.getIframeDOM();
    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      const top = evt.data.top + rect.top + scrollTop;
      window.scroll({ top });
    }
  }

  handleResize(evt: MessageEvent) {
    if (!evt.data.height) {
      return;
    }
    const iframe = this.getIframeDOM();
    if (iframe) {
      const newHeight = parseInt(get(evt, 'data.height', 0), 10);
      iframe.style.height = `${newHeight}px`; // eslint-disable-line no-param-reassign
    }
  }

  handleIframeMessages(event: MessageEvent) {
    const iframe = this.getIframeDOM();
    /* Needed to enforce content to stay within iframe on Safari iOS */
    if (iframe) {
      iframe.setAttribute('scrolling', 'no');
    }

    if (
      !this.state.listeningToMessages ||
      !event ||
      !event.data ||
      iframe?.contentWindow !== event.source
    ) {
      return;
    }

    switch (event.data.event) {
      case 'resize':
        this.handleResize(event);
        break;
      case 'scrollTo':
        this.handleScrollTo(event);
        break;
      default:
        break;
    }
  }

  render() {
    const { html } = this.props;

    return (
      <div
        ref={iframeDiv => {
          this._iframeDiv = iframeDiv;
        }}>
        {parse(html)}
      </div>
    );
  }
}
