import React from 'react';
//@ts-ignore
import { Image } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { GQLVisualElement } from '../../graphqlTypes';

interface Props {
  visualElement: GQLVisualElement;
}

export const getIframeSrcFromHtmlString = (
  html: string,
): string | undefined => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe?.getAttribute('src') || undefined;
};

const getFocalPoint = (visualElement: GQLVisualElement): object | undefined => {
  if (visualElement.focalX && visualElement.focalY) {
    return { x: visualElement.focalX, y: visualElement.focalY };
  }
  return undefined;
};

const getCrop = (visualElement: GQLVisualElement): object | undefined => {
  if (
    (visualElement.lowerRightX &&
      visualElement.lowerRightY &&
      visualElement.upperLeftX &&
      visualElement.upperLeftY) !== null
  ) {
    return {
      startX: visualElement.lowerRightX,
      startY: visualElement.lowerRightY,
      endX: visualElement.upperLeftX,
      endY: visualElement.upperLeftY,
    };
  }
  return undefined;
};

const VisualElement = ({ visualElement }: Props) => {
  if (visualElement.resource === 'image') {
    return (
      <Image
        alt={visualElement.alt}
        crop={getCrop(visualElement)}
        focalPoint={getFocalPoint(visualElement)}
        src={visualElement?.image?.src}
      />
    );
  } else if (visualElement.resource === 'brightcove') {
    return (
      <iframe
        frameBorder="0"
        height={400}
        src={visualElement.url}
        title={visualElement.title}
        width={600}
      />
    );
  } else if (
    visualElement.resource === 'h5p' ||
    visualElement.resource === 'external'
  ) {
    return (
      <iframe
        allowFullScreen={visualElement?.oembed?.fullscreen || true}
        frameBorder="0"
        height={400}
        src={getIframeSrcFromHtmlString(visualElement?.oembed?.html!)}
        title={visualElement?.oembed?.title}
        width={600}
      />
    );
  }
  return null;
};

export default injectT(VisualElement);
