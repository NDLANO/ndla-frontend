/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
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

import CopyTextButton from '../../components/license/CopyTextButton';
import AnchorButton from '../../components/license/AnchorButton';
import config from '../../config';
import { GQLAudio } from '../../graphqlTypes';

interface Props {
  podcast: GQLAudio;
}

const Podcast = ({ podcast }: Props) => {
  const [mounted, setMounted] = useState(false);
  const {
    i18n: { language },
  } = useTranslation();

  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(podcast.copyright?.license?.license, language);

  const coverPhoto = podcast.podcastMeta?.coverPhoto && {
    url: podcast.podcastMeta?.coverPhoto?.url,
    alt: podcast.podcastMeta?.coverPhoto?.altText,
  };

  const { t } = useTranslation();
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    } else {
      initArticleScripts();
    }
  }, [mounted]);

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
    language,
  ).map(item => ({
    name: item.description,
    type: item.label,
  }));

  const id = podcast.id.toString();
  const figureId = `figure-podcast-${id}`;

  return (
    <Figure id={figureId} type="full-column">
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title.title}
        description={podcast.podcastMeta?.introduction}
        img={coverPhoto}
        textVersion={podcast.manuscript?.manuscript}
      />
      {mounted && (
        <FigureLicenseDialog
          id={id}
          authors={contributors}
          locale={language}
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
      )}
      <FigureCaption
        figureId={figureId}
        id={id}
        locale={language}
        key="caption"
        caption={podcast.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={contributors}></FigureCaption>
    </Figure>
  );
};

export default Podcast;
