import React from 'react';
//@ts-ignore
import { Image } from '@ndla/ui';
import { GQLVisualElement } from '../../graphqlTypes';
import { getCrop, getFocalPoint } from '../../util/imageHelpers';

interface Props {
  visualElement: GQLVisualElement;
}

export const getIframeSrcFromHtmlString = (
  html?: string,
): string | undefined => {
  if (!html) return undefined;
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe?.getAttribute('src') || undefined;
};

const VisualElement = ({ visualElement }: Props) => {
  if (visualElement.image) {
    return (
      <Image
        alt={visualElement.image.alt || visualElement.image.altText}
        crop={getCrop(visualElement.image)}
        focalPoint={getFocalPoint(visualElement.image)}
        src={visualElement?.image?.src}
      />
    );
  } else if (visualElement.brightcove) {
    return (
      <iframe
        frameBorder="0"
        height={visualElement.brightcove.iframe?.height}
        src={visualElement.url}
        title={visualElement.title}
        width={visualElement.brightcove.iframe?.width}
      />
    );
  } else if (visualElement.h5p) {
    return (
      <iframe
        allowFullScreen={true}
        frameBorder="0"
        src={visualElement.url}
        title={visualElement.title}
      />
    );
  } else if (visualElement.oembed) {
    return (
      <iframe
        allowFullScreen={visualElement?.oembed?.fullscreen || true}
        frameBorder="0"
        src={getIframeSrcFromHtmlString(visualElement?.oembed?.html)}
        title={visualElement?.oembed?.title}
      />
    );
  }
  return null;
};

export default VisualElement;
