import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AudioPlayer,
  Figure,
  FigureCaption,
  FigureLicenseDialog,
} from '@ndla/ui';
import {
  getLicenseByAbbreviation,
  getCopyString,
  getGroupedContributorDescriptionList,
  getLicenseCredits,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';

import { LocaleType } from '.../../../interfaces';
import CopyTextButton from '../../components/license/CopyTextButton';
import AnchorButton from '../../components/license/AnchorButton';
import config from '../../config';
import { GQLAudio } from '../../graphqlTypes';

interface Props {
  podcast: GQLAudio;
  locale: LocaleType;
}

const Podcast = ({ podcast, locale }: Props) => {
  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(podcast.copyright?.license?.license, locale);

  const coverPhoto = podcast.podcastMeta?.coverPhoto && {
    url: podcast.podcastMeta?.coverPhoto?.url,
    alt: podcast.podcastMeta?.coverPhoto?.altText,
  };

  const { t } = useTranslation();
  useEffect(() => {
    initArticleScripts();
  }, []);

  const messages = {
    learnAboutLicenses: license
      ? license.linkText
      : t('license.learnMore') || '',
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t('license.audio.rules'),
    reuse: t('audio.reuse'),
    download: t('audio.download'),
  };

  const licenseCredits = getLicenseCredits(podcast.copyright);

  const contributors = getGroupedContributorDescriptionList(
    licenseCredits,
    locale,
  ).map(item => ({
    name: item.description,
    type: item.label,
  }));

  return (
    <Figure id={`figure-${podcast.id}`} type="full-column">
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title.title}
        description={podcast.podcastMeta?.introduction}
        img={coverPhoto}
        textVersion={podcast.manuscript?.manuscript}
      />
      <FigureCaption
        figureId={`figure-${podcast.id}`}
        id={`${podcast.id}`}
        locale={locale}
        key="caption"
        caption={podcast.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={contributors}>
        <FigureLicenseDialog
          id={`${podcast.id}`}
          authors={contributors}
          locale={locale}
          license={getLicenseByAbbreviation(
            podcast.copyright.license?.license!,
            'nb',
          )}
          messages={messages}
          title={podcast.title.title}
          origin={podcast.copyright.origin}>
          <CopyTextButton
            stringToCopy={getCopyString(
              podcast.title.title,
              undefined,
              `/podcast/${podcast.id}`,
              podcast.copyright,
              config.ndlaFrontendDomain,
              key => t(key),
            )}
            copyTitle={t('license.copyTitle')}
            hasCopiedTitle={t('license.hasCopiedTitle')}
          />
          {podcast.copyright.license?.license !== 'COPYRIGHTED' && (
            <AnchorButton
              href={podcast.audioFile.url}
              download
              appearance="outline">
              {t('license.download')}
            </AnchorButton>
          )}
        </FigureLicenseDialog>
      </FigureCaption>
    </Figure>
  );
};

export default Podcast;
