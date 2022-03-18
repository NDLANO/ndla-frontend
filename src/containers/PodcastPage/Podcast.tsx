/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
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
  figureApa7CopyString,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';
import styled from '@emotion/styled';
import { gql } from '@apollo/client';
import { MastheadHeightPx } from '../../constants';

import CopyTextButton from '../../components/license/CopyTextButton';
import AnchorButton from '../../components/license/AnchorButton';
import config from '../../config';
import { GQLPodcast_AudioFragment } from '../../graphqlTypes';
import { copyrightInfoFragment } from '../../queries';

interface Props {
  podcast: GQLPodcast_AudioFragment;
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

  const image = podcast.podcastMeta?.image;

  const simpleImage = image && {
    url: image.imageUrl,
    alt: image.altText,
  };

  const { t } = useTranslation();
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    } else {
      initArticleScripts();
    }
  }, [mounted]);

  const podcastMessages = {
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

  const imageMessages = {
    learnAboutLicenses: t('license.learnMore'),
    title: t('title'),
    close: t('close'),
    source: t('source'),
    rulesForUse: t('license.image.rules'),
    reuse: t('image.reuse'),
    download: t('image.download'),
  };

  const licenseCredits = getLicenseCredits(podcast.copyright);

  const podcastContributors = getGroupedContributorDescriptionList(
    licenseCredits,
    language,
  ).map(item => ({
    name: item.description,
    type: item.label,
  }));

  const imageContributors =
    image &&
    getGroupedContributorDescriptionList(licenseCredits, language).map(
      item => ({
        name: item.description,
        type: item.label,
      }),
    );

  const imageRights =
    image &&
    getLicenseByAbbreviation(image.copyright.license.license, language).rights;

  const id = podcast.id.toString();
  const figureId = `figure-${id}`;

  return (
    <Figure id={figureId} type="full-column">
      <InvisibleAnchor id={`episode-${id}`} />
      <AudioPlayer
        src={podcast.audioFile.url}
        title={podcast.title.title}
        description={podcast.podcastMeta?.introduction}
        img={simpleImage}
        textVersion={podcast.manuscript?.manuscript}
      />
      <FigureCaption
        figureId={figureId}
        id={id}
        locale={language}
        caption={podcast.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={podcastContributors}>
        {mounted && (
          <FigureLicenseDialog
            id={id}
            authors={podcastContributors}
            locale={language}
            license={getLicenseByAbbreviation(
              podcast.copyright.license?.license!,
              'nb',
            )}
            messages={podcastMessages}
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
      {image && (
        <div id={image.id}>
          <FigureCaption
            figureId={image.id}
            id={image.id}
            licenseRights={imageRights || []}
            locale={language}
            reuseLabel={t('other.reuse')}
            authors={imageContributors}>
            {mounted && (
              <FigureLicenseDialog
                id={image.id}
                authors={imageContributors}
                locale={language}
                license={getLicenseByAbbreviation(
                  image.copyright.license.license!,
                  'nb',
                )}
                messages={imageMessages}
                title={image.title}
                origin={image.copyright.origin}>
                <CopyTextButton
                  stringToCopy={figureApa7CopyString(
                    image.title,
                    undefined,
                    undefined,
                    `/podkast/${seriesId}#episode-${podcast.id}`,
                    image.copyright,
                    image.copyright.license.license,
                    config.ndlaFrontendDomain,
                    key => t(key),
                    language,
                  )}
                  copyTitle={t('license.copyTitle')}
                  hasCopiedTitle={t('license.hasCopiedTitle')}
                />
                {image.copyright.license?.license !== 'COPYRIGHTED' && (
                  <AnchorButton
                    href={image.imageUrl}
                    download
                    appearance="outline">
                    {t('license.download')}
                  </AnchorButton>
                )}
              </FigureLicenseDialog>
            )}
          </FigureCaption>
        </div>
      )}
    </Figure>
  );
};

Podcast.fragments = {
  podcast: gql`
    fragment Podcast_Audio on Audio {
      id
      title {
        title
      }
      audioFile {
        url
      }
      copyright {
        ...CopyrightInfo
      }
      manuscript {
        manuscript
      }
      created
      audioType
      podcastMeta {
        introduction
        image {
          copyright {
            ...CopyrightInfo
          }
          id
          imageUrl
          title
          altText
        }
      }
    }
    ${copyrightInfoFragment}
  `,
};

export default Podcast;
