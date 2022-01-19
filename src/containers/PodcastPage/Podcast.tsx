import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AudioPlayer,
  Figure,
  FigureCaption,
  FigureLicenseDialog,
} from '@ndla/ui';
import { getLicenseByAbbreviation } from '@ndla/licenses';
// @ts-ignore
import Button from '@ndla/button';
import { initArticleScripts } from '@ndla/article-scripts';

import { AudioLicenseInfo } from '../../components/license/AudioLicenseList';
import { Audio, LocaleType } from '.../../../interfaces';
import { getLicenseCredits } from './util';
import CopyTextButton from '../../components/license/CopyTextButton';
import AnchorButton from '../../components/license/AnchorButton';

interface Props {
  podcast: Audio;
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
        authors={getLicenseCredits(podcast.copyright)}>
        <FigureLicenseDialog
          id={`${podcast.id}`}
          authors={getLicenseCredits(podcast.copyright)}
          locale={locale}
          license={getLicenseByAbbreviation(
            podcast.copyright.license?.license!,
            'nb',
          )}
          messages={messages}
          title={podcast.title.title}
          origin={podcast.copyright.origin}>
          {/* <CopyTextButton
            stringToCopy={podcast.copyright.license.copyText}
            copyTitle={t('license.copyTitle')}
            hasCopiedTitle={t('license.hasCopiedTitle')}
          /> */}
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
