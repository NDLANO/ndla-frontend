import {
  Figure,
  OneColumn,
  FigureCaption,
  FigureLicenseDialog,
  Image,
  ContentPlaceholder,
} from '@ndla/ui';

import {
  figureApa7CopyString,
  getLicenseByAbbreviation,
  getLicenseCredits,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { initArticleScripts } from '@ndla/article-scripts';
import { useParams } from 'react-router-dom';
import { SafeLinkButton } from '@ndla/safelink';
import { GQLImageQuery } from '../../graphqlTypes';
import { imageQuery } from '../../queries';
import CopyTextButton from '../../components/license/CopyTextButton';
import config from '../../config';
import { useGraphQuery } from '../../util/runQueries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import {
  getPrioritizedAuthors,
  getGroupedAuthors,
} from '../../util/copyrightHelpers';

const ImagePage = () => {
  const { i18n, t } = useTranslation();
  const { imageId } = useParams();

  const { data, loading: isLoadingImage, error } = useGraphQuery<GQLImageQuery>(
    imageQuery,
    {
      variables: { id: imageId },
      skip: !imageId?.match('^[0-9]*$')?.toString(),
    },
  );
  useEffect(() => {
    initArticleScripts();
  }, [isLoadingImage]);

  if (isLoadingImage) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data?.image || !data) {
    return <NotFoundPage />;
  }

  const image = data.image;

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
    <OneColumn>
      <Figure id={image?.id} type="full-column">
        <Image alt={image.alttext.alttext} src={image.imageUrl} />
        <FigureCaption
          figureId={image.id}
          id={image.id}
          licenseRights={imageRights}
          locale={i18n.language}
          reuseLabel={t('image.reuse')}
          authors={imageContributors}>
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
            origin={image.copyright?.origin}>
            <CopyTextButton
              stringToCopy={figureApa7CopyString(
                image.title.title,
                image.created,
                image.imageUrl,
                `/resources/images/${image.id}`,
                image.copyright,
                image.copyright.license.license,
                config.ndlaFrontendDomain,
                key => t(key),
                i18n.language,
              )}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />

            {image.copyright.license.license !== 'COPYRIGHTED' && (
              <SafeLinkButton to={image.imageUrl} download outline>
                {t('license.download')}
              </SafeLinkButton>
            )}
          </FigureLicenseDialog>
        </FigureCaption>
      </Figure>
    </OneColumn>
  );
};

export default ImagePage;
