import React from 'react';
//@ts-ignore
import { Image } from '@ndla/ui';
import { GQLVisualElement } from '../../../graphqlTypes';

interface VisualElement {
  visualElement: GQLVisualElement;
}

const VisualElementWrapper = ({ visualElement }: VisualElement) => {
  const { resource, url, alt, image } = visualElement;
  switch (resource) {
    case 'image':
      return <Image alt={alt} src={image?.src} />;
    default:
    case 'video':
    case 'other':
      return (
        <iframe
          title="About subject video"
          src={url}
          allowFullScreen
          scrolling="no"
          frameBorder="0"
        />
      );
  }
};

export default VisualElementWrapper;
