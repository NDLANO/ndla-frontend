import React from 'react';
//@ts-ignore
import { Image } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { GQLVisualElement } from '../../../graphqlTypes';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

interface VisualElement {
  visualElement: GQLVisualElement;
}

const IframeContainer = styled.div`
  margin-bottom: ${spacing.normal};
  & > iframe {
    padding-top: 1em;
    border: 0 none;
    max-width: 100%;
    height:65vh;
  }
`

const VisualElementWrapper = ({ visualElement, t }: VisualElement & tType) => {
  const { resource, url, alt, image, oembed } = visualElement;
  switch (resource) {
    case 'image':
      return <Image alt={alt} src={image?.src} />;
    case 'brightcove':
      return (
      <IframeContainer >
          <iframe
            title={t('htmlTitle.toolbox.visualElement')}
            src={url}
            allowFullScreen
            scrolling="no"
            frameBorder="0"
          />
      </IframeContainer>
        
        )
    default:
    case 'video':  
    case 'external':
      return (
        <IframeContainer dangerouslySetInnerHTML={{__html: oembed?.html!}}/>
      );
  }
};

export default injectT(VisualElementWrapper);
