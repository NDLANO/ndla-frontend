import React from 'react';
import { GQLVisualElementInfoFragment } from '../../../graphqlTypes';
import FigureNotion from './FigureNotion';

interface Props {
  visualElement: GQLVisualElementInfoFragment;
}

const supportedEmbedTypes = ['brightcove', 'h5p'];
const NotionVisualElement = ({ visualElement }: Props) => {
  const id = '1';
  const figureId = 'figure-1';
  if (
    !visualElement.resource ||
    !supportedEmbedTypes.includes(visualElement.resource)
  ) {
    return <p>Embed type is not supported!</p>;
  }

  const type = visualElement.resource === 'brightcove' ? 'video' : 'h5p';
  return (
    <FigureNotion
      resizeIframe
      id={id}
      figureId={figureId}
      title={visualElement.title ?? ''}
      copyright={visualElement.copyright}
      licenseString={visualElement.copyright?.license.license ?? ''}
      type={type}>
      <iframe title={visualElement.title} src={visualElement.url} />
    </FigureNotion>
  );
};

export default NotionVisualElement;
