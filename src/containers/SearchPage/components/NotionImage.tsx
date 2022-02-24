import { FigureExpandButton, Image } from '@ndla/ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Copyright } from '@ndla/ui/lib/types';
import FigureNotion from './FigureNotion';
interface Props {
  id: string;
  src: string;
  alt: string;
  imageCopyright?: Copyright;
}
export const NotionImage = ({ id, src, alt, imageCopyright }: Props) => {
  const { t } = useTranslation();

  const imageId = `image-${id}`;
  const imageFigureId = `image-figure-${id}`;

  return (
    <FigureNotion
      hideFigCaption
      figureId={imageFigureId}
      id={imageId}
      title={alt}
      copyright={imageCopyright}
      licenseString={imageCopyright?.license.license ?? ''}
      type={'image'}>
      {({ typeClass }) => (
        <Image
          alt={alt}
          src={src}
          expandButton={
            <FigureExpandButton
              typeClass={typeClass}
              messages={{
                zoomImageButtonLabel: t(
                  'license.images.itemImage.zoomImageButtonLabel',
                ),
                zoomOutImageButtonLabel: t(
                  'license.image.itemImage.zoomOutImageButtonLabel',
                ),
              }}
            />
          }
        />
      )}
    </FigureNotion>
  );
};
