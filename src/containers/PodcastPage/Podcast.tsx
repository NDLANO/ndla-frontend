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
  getGroupedContributorDescriptionList,
  getLicenseCredits,
  podcastEpisodeApa7CopyString,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';
import styled from '@emotion/styled';
import { MastheadHeightPx } from '../../constants';

import CopyTextButton from '../../components/license/CopyTextButton';
import AnchorButton from '../../components/license/AnchorButton';
import config from '../../config';
import { GQLAudio } from '../../graphqlTypes';

interface Props {
  podcast: GQLAudio;
  seriesId: string;
}

const InvisibleAnchor = styled.a`
  top: -${MastheadHeightPx + 20}px;
  position: absolute;
`;

const Podcast = ({ podcast, seriesId }: Props) => {
  const [mounted, setMounted] = useState(false);
  const {
    i18n: { language },
  } = useTranslation();

  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(podcast.copyright?.license?.license, language);

  const image = podcast.podcastMeta?.coverPhoto && {
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
  const figurePodcastId = `figure-podcast-${id}`;

  return (
    <Figure id={figurePodcastId} type="full-column">
      <InvisibleAnchor id={`episode-${id}`} />
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title.title}
        description={podcast.podcastMeta?.introduction}
        img={image}
        textVersion={podcast.manuscript?.manuscript}
      />
      <FigureCaption
        figureId={figurePodcastId}
        id={id}
        locale={language}
        key="caption"
        caption={podcast.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={contributors}>
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
              stringToCopy={podcastEpisodeApa7CopyString(
                podcast.title.title,
                podcast.created,
                seriesId,
                podcast.id,
                podcast.copyright,
                language,
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
      </FigureCaption>
    </Figure>
  );
};

export default Podcast;
