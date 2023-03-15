/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AudioPlayer,
  Figure,
  FigureCaption,
  FigureLicenseDialog,
} from '@ndla/ui';
import {
  getLicenseByAbbreviation,
  getLicenseCredits,
  podcastEpisodeApa7CopyString,
  figureApa7CopyString,
  getCopyString,
} from '@ndla/licenses';
import { initArticleScripts } from '@ndla/article-scripts';
import { gql } from '@apollo/client';
import { SafeLinkButton } from '@ndla/safelink';

import CopyTextButton from '../../components/license/CopyTextButton';
import config from '../../config';
import { GQLPodcast_AudioFragment } from '../../graphqlTypes';
import { copyrightInfoFragment } from '../../queries';
import {
  getPrioritizedAuthors,
  getGroupedAuthors,
} from '../../util/copyrightHelpers';

interface Props {
  audio: GQLPodcast_AudioFragment;
  seriesId?: string;
}

const Audio = ({ audio, seriesId = '' }: Props) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const license =
    audio.copyright?.license &&
    getLicenseByAbbreviation(audio.copyright?.license?.license, language);

  const image = audio.podcastMeta?.image;

  const simpleImage = image && {
    url: image.imageUrl,
    alt: image.altText,
  };

  useEffect(() => {
    initArticleScripts();
  }, []);

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

  const licenseCredits = getLicenseCredits(audio.copyright);

  const podcastContributors = getPrioritizedAuthors(licenseCredits);

  const imageContributors =
    image && getPrioritizedAuthors(getLicenseCredits(image.copyright));

  const podcastGroupedContributors = getGroupedAuthors(
    licenseCredits,
    language,
  );

  const imageGroupedContributors =
    image && getGroupedAuthors(image.copyright, language);

  const imageRights =
    image &&
    getLicenseByAbbreviation(image.copyright.license.license, language).rights;

  const id = audio.id.toString();
  const figureId = `episode-${id}`;

  const imageId = `episode-${id}-image-${image?.id}`;

  return (
    <Figure id={figureId} type="full-column">
      <AudioPlayer
        src={audio.audioFile.url}
        title={audio.title.title}
        description={audio.podcastMeta?.introduction}
        img={simpleImage}
        textVersion={audio.manuscript?.manuscript}
      />
      <FigureCaption
        figureId={figureId}
        id={id}
        locale={language}
        caption={audio.title.title}
        licenseRights={license?.rights || []}
        reuseLabel={t('other.reuse')}
        authors={podcastContributors}
      >
        <FigureLicenseDialog
          id={id}
          authors={podcastGroupedContributors}
          locale={language}
          license={getLicenseByAbbreviation(
            audio.copyright.license?.license!,
            'nb',
          )}
          messages={podcastMessages}
          title={audio.title.title}
          origin={audio.copyright.origin}
        >
          <CopyTextButton
            stringToCopy={
              seriesId
                ? podcastEpisodeApa7CopyString(
                    audio.title.title,
                    audio.created,
                    seriesId,
                    audio.id,
                    audio.copyright,
                    language,
                    config.ndlaFrontendDomain,
                    key => t(key),
                  )
                : getCopyString(
                    audio.title.title,
                    audio.created,
                    `/resources/audios/${audio.id}`,
                    audio.copyright,
                    config.ndlaFrontendDomain,
                    key => t(key),
                  )
            }
            copyTitle={t('license.copyTitle')}
            hasCopiedTitle={t('license.hasCopiedTitle')}
          />
          {audio.copyright.license?.license !== 'COPYRIGHTED' && (
            <SafeLinkButton to={audio.audioFile.url} download variant="outline">
              {t('license.download')}
            </SafeLinkButton>
          )}
        </FigureLicenseDialog>
      </FigureCaption>
      {image && (
        <div id={imageId}>
          <FigureCaption
            figureId={imageId}
            id={imageId}
            licenseRights={imageRights || []}
            locale={language}
            reuseLabel={t('image.reuse')}
            authors={imageContributors}
          >
            <FigureLicenseDialog
              id={imageId}
              authors={imageGroupedContributors}
              locale={language}
              license={getLicenseByAbbreviation(
                image.copyright.license.license!,
                'nb',
              )}
              messages={imageMessages}
              title={image.title}
              origin={image.copyright.origin}
            >
              {image.copyright.license?.license !== 'COPYRIGHTED' && (
                <>
                  <CopyTextButton
                    stringToCopy={figureApa7CopyString(
                      image.title,
                      undefined,
                      undefined,
                      `/podkast/${seriesId}#episode-${audio.id}`,
                      image.copyright,
                      image.copyright.license.license,
                      config.ndlaFrontendDomain,
                      key => t(key),
                      language,
                    )}
                    copyTitle={t('license.copyTitle')}
                    hasCopiedTitle={t('license.hasCopiedTitle')}
                  />
                  <SafeLinkButton
                    to={image.imageUrl}
                    download
                    variant="outline"
                  >
                    {t('license.download')}
                  </SafeLinkButton>
                </>
              )}
            </FigureLicenseDialog>
          </FigureCaption>
        </div>
      )}
    </Figure>
  );
};

Audio.fragments = {
  audio: gql`
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

export default Audio;
