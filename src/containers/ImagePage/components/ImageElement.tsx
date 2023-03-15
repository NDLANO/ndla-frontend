/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  getLicenseByAbbreviation,
  figureApa7CopyString,
  getLicenseCredits,
} from '@ndla/licenses';
import { SafeLinkButton } from '@ndla/safelink';
import { Figure, FigureCaption, FigureLicenseDialog, Image } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { initArticleScripts } from '@ndla/article-scripts';
import { useEffect } from 'react';
import {
  getPrioritizedAuthors,
  getGroupedAuthors,
} from '../../../util/copyrightHelpers';
import CopyTextButton from '../../../components/license/CopyTextButton';
import config from '../../../config';
import { GQLImageMetaInformationV2 } from '../../../graphqlTypes';

interface Props {
  image: GQLImageMetaInformationV2;
}

const ImageElement = ({ image }: Props) => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    initArticleScripts();
  }, []);

  const imageMessages = {
    learnAboutLicenses: t('license.learnMore'),
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t('license.image.rules'),
    reuse: t('image.reuse'),
    download: t('image.download'),
  };

  const imageCopyrigthers = {
    creators: image.copyright.creators,
    rightsholders: image.copyright.rightsholders,
    processors: image.copyright.processors,
  };

  const imageContributors = getPrioritizedAuthors(
    getLicenseCredits(imageCopyrigthers),
  );

  const imageGroupedContributors = getGroupedAuthors(
    imageCopyrigthers,
    i18n.language,
  );

  const imageRights = getLicenseByAbbreviation(
    image.copyright.license.license,
    i18n.language,
  ).rights;

  return (
    <Figure id={image?.id} type="full-column">
      <Image alt={image.alttext.alttext} src={image.imageUrl} />
      <FigureCaption
        figureId={image.id}
        id={image.id}
        licenseRights={imageRights}
        locale={i18n.language}
        reuseLabel={t('image.reuse')}
        authors={imageContributors}
      >
        <FigureLicenseDialog
          id={image.id}
          authors={imageGroupedContributors}
          locale={i18n.language}
          license={getLicenseByAbbreviation(
            image.copyright.license.license,
            'nb',
          )}
          messages={imageMessages}
          title={image.title.title}
          origin={image.copyright?.origin}
        >
          <CopyTextButton
            stringToCopy={figureApa7CopyString(
              image.title.title,
              image.created,
              image.imageUrl,
              `/resources/images/${image.id}`,
              image.copyright,
              image.copyright.license.license,
              config.ndlaFrontendDomain,
              (key) => t(key),
              i18n.language,
            )}
            copyTitle={t('license.copyTitle')}
            hasCopiedTitle={t('license.hasCopiedTitle')}
          />

          {image.copyright.license.license !== 'COPYRIGHTED' && (
            <SafeLinkButton to={image.imageUrl} download>
              {t('license.download')}
            </SafeLinkButton>
          )}
        </FigureLicenseDialog>
      </FigureCaption>
    </Figure>
  );
};

ImageElement.fragments = {
  image: gql`
    fragment ImageElement on ImageMetaInformationV2 {
      id
      metaUrl
      title {
        language
        title
      }
      alttext {
        language
        alttext
      }
      imageUrl
      size
      contentType
      copyright {
        ...CopyrightInfo
      }
      tags {
        language
        tags
      }
      caption {
        language
        caption
      }
      supportedLanguages
      created
      createdBy
      modelRelease
      editorNotes {
        timestamp
        updatedBy
        note
      }
      imageDimensions {
        width
        height
      }
    }
  `,
};

export default ImageElement;
