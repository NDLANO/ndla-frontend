import React from 'react';
//@ts-ignore
import { Image } from '@ndla/ui';
import { GQLVisualElement } from '../../../graphqlTypes';
import { injectT, tType } from '@ndla/i18n';

interface VisualElement {
  visualElement: GQLVisualElement;
}

const VisualElementWrapper = ({ visualElement, t }: VisualElement & tType) => {
  const { resource, url, alt, image } = visualElement;
  switch (resource) {
    case 'image':
      return <Image alt={alt} src={image?.src} />;
    default:
    case 'video':
    case 'other':
      return (
        <iframe
          title={t('htmlTitle.toolbox.visualElement')}
          src={url}
          allowFullScreen
          scrolling="no"
          frameBorder="0"
        />
      );
  }
};

export default injectT(VisualElementWrapper);
