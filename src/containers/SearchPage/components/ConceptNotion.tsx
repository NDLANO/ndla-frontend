import React from 'react';
import { Notion } from '@ndla/ui';
import {
  GQLConceptCopyright,
  GQLConceptSearchConceptFragment,
} from '../../../graphqlTypes';
import { NotionImage } from './NotionImage';
import NotionVisualElement from './NotionVisualElement';
import FigureNotion from './FigureNotion';
interface Props {
  concept: GQLConceptSearchConceptFragment;
}

const mockCopyright: GQLConceptCopyright = {
  creators: [
    {
      type: 'artist',
      name: 'Picasso',
    },
    {
      type: 'photographer',
      name: 'Tor foto',
    },
  ],
  processors: [
    {
      type: 'processor',
      name: 'Process or?',
    },
  ],
  rightsholders: [
    {
      type: 'rightsholder',
      name: 'Sjefen',
    },
  ],
  license: {
    license: 'CC-BY-NS-SA-4.0',
  },
  origin: 'https://ndla.no',
};

const ConceptNotion = ({ concept }: Props) => {
  const notionId = `notion-${concept.id}`;
  const figureId = `notion-figure-${concept.id}`;
  const visualElementId = `visual-element-${concept.id}`;
  return (
    <FigureNotion
      id={figureId}
      figureId={visualElementId}
      copyright={mockCopyright}
      title={concept.title}
      licenseString={mockCopyright.license?.license ?? ''}
      type="concept">
      <Notion
        id={notionId}
        title={concept.title}
        text={concept.text}
        labels={concept.subjectNames}
        imageElement={
          concept.visualElement?.resource === 'image' &&
          concept.visualElement.image ? (
            <NotionImage
              id={visualElementId}
              src={concept.visualElement.image.src}
              alt={concept.visualElement.image.alt ?? ''}
              imageCopyright={concept.visualElement.copyright}
            />
          ) : (
            undefined
          )
        }
        visualElement={
          concept.visualElement && concept.visualElement.resource !== 'image'
            ? {
                type:
                  concept.visualElement.resource === 'brightcove'
                    ? 'video'
                    : 'other',
                metaImage: {
                  url: concept.image.url,
                  alt: concept.image.alt,
                },
                element: (
                  <NotionVisualElement visualElement={concept.visualElement} />
                ),
              }
            : undefined
        }></Notion>
    </FigureNotion>
  );
};

export default ConceptNotion;
