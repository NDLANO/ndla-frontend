/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useRef } from 'react';
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
}

const LearningpathIframe = ({ html }: Props) => {
  const iframeWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const iframe = iframeWrapperRef.current?.querySelector('iframe');
    if (iframe) {
      const [width, height] = [parseInt(iframe.width), parseInt(iframe.height)];
      iframe.style.aspectRatio = `${width ? width : 16}/${height ? height : 9}`;
      iframe.width = '';
      iframe.height = '';
    }
  }, []);

  return <div ref={iframeWrapperRef}>{parse(html)}</div>;
};

export default LearningpathIframe;
