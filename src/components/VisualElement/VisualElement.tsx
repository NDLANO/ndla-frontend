import { gql } from '@apollo/client';
import { Image } from '@ndla/ui';
import { GQLVisualElement_VisualElementFragment } from '../../graphqlTypes';
import { getCrop, getFocalPoint } from '../../util/imageHelpers';

interface Props {
  visualElement: GQLVisualElement_VisualElementFragment;
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

VisualElement.fragments = {
  visualElement: gql`
    fragment VisualElement_VisualElement on VisualElement {
      url
      title
      image {
        alt
        altText
        src
        focalX
        focalY
        lowerRightX
        lowerRightY
        upperLeftX
        upperLeftY
      }
      oembed {
        html
        fullscreen
        title
      }
      brightcove {
        iframe {
          height
          width
        }
      }
      # unused, but used for type checking
      h5p {
        src
      }
    }
  `,
};

export default VisualElement;
