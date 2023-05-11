/**
 * Copyright (C) 2021 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { FigureCaption, FigureLicenseDialog, Figure } from '@ndla/ui';
import {
  getGroupedContributorDescriptionList,
  getLicenseByAbbreviation,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';
import { uuid } from '@ndla/util';
import { GQLVisualElementWrapper_VisualElementFragment } from '../../graphqlTypes';
import VisualElement from './VisualElement';
import VisualElementLicenseButtons from './VisualElementLicenseButtons';
import { ResourceType } from '../../interfaces';

interface Props {
  visualElement: GQLVisualElementWrapper_VisualElementFragment;
  videoId?: string;
}

const StyledFigure = styled(Figure)`
  margin: 0;
  width: 100% !important;
  height: 100%;
  right: auto !important;
  left: auto !important;
`;

export const getResourceType = (VisualElementType?: string): ResourceType => {
  switch (VisualElementType) {
    case 'external':
    case 'brightcove':
      return 'video';
    case 'image':
      return 'image';
    default:
      return 'other';
  }
};

const VisualElementWrapper = ({ visualElement, videoId }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    initArticleScripts();
  }, []);

  const copyright = visualElement.copyright;

  const license = getLicenseByAbbreviation(copyright?.license?.license!, 'nb');
  const contributors = getGroupedContributorDescriptionList(
    {
      rightsholders: copyright?.rightsholders ?? [],
      creators: copyright?.creators ?? [],
      processors: copyright?.processors ?? [],
    },
    i18n.language,
  ).map((item) => ({ name: item.description, type: item.label }));
  const possibleAuthors = [
    [...(copyright?.creators || []), ...(copyright?.rightsholders || [])],
    copyright?.processors,
  ];
  const authors =
    possibleAuthors.find((grouping) => grouping && grouping.length > 0) ?? [];
  const caption =
    visualElement.image?.caption || visualElement.brightcove?.caption || '';

  const resourceType = getResourceType(visualElement.resource);

  const messages = {
    learnAboutLicenses: license
      ? license.linkText
      : t('license.learnMore') || '',
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t(`license.${resourceType}.rules`),
    reuse: t(`${resourceType}.reuse`),
    download: t(`${resourceType}.download`),
  };
  const id = videoId ?? uuid();
  const figureId = `figure-${id}`;
  return (
    <StyledFigure id={figureId} resizeIframe={true}>
      <VisualElement visualElement={visualElement} />
      {visualElement.resource !== 'external' && copyright && (
        <FigureCaption
          id={id}
          figureId={figureId}
          locale={i18n.language}
          caption={caption}
          reuseLabel={messages.reuse}
          licenseRights={license.rights}
          authors={authors}
        >
          <FigureLicenseDialog
            id={id}
            authors={contributors}
            locale={i18n.language}
            license={license}
            messages={messages}
            title={visualElement.title}
            origin={copyright?.origin}
          >
            <VisualElementLicenseButtons
              visualElement={visualElement}
              resourceType={resourceType}
            />
          </FigureLicenseDialog>
        </FigureCaption>
      )}
    </StyledFigure>
  );
};

VisualElementWrapper.fragments = {
  visualElement: gql`
    fragment VisualElementWrapper_VisualElement on VisualElement {
      resource
      copyright {
        origin
        license {
          license
        }
        creators {
          name
          type
        }
        processors {
          name
          type
        }
        rightsholders {
          name
          type
        }
      }
      image {
        caption
      }
      brightcove {
        caption
      }
      ...VisualElement_VisualElement
      ...VisualElementLicenseButtons_VisualElement
    }
    ${VisualElement.fragments.visualElement}
    ${VisualElementLicenseButtons.fragments.visualElement}
  `,
};

export default VisualElementWrapper;
