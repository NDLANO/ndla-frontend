/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { Notion } from '@ndla/ui';
import { GQLConceptSearchConceptFragment } from '../../../graphqlTypes';
import { NotionImage } from './NotionImage';
import NotionVisualElement from './NotionVisualElement';
import FigureNotion from './FigureNotion';
interface Props {
  concept: GQLConceptSearchConceptFragment;
}

const ConceptNotion = ({ concept }: Props) => {
  const notionId = `notion-${concept.id}`;
  const figureId = `notion-figure-${concept.id}`;
  const visualElementId = `visual-element-${concept.id}`;
  return (
    <FigureNotion
      id={figureId}
      figureId={visualElementId}
      copyright={concept.copyright}
      title={concept.title}
      licenseString={concept.copyright?.license?.license ?? ''}
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
