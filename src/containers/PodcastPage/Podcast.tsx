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
  podcast: GQLPodcast_AudioFragment;
  seriesId: string;
}

const Podcast = ({ podcast, seriesId }: Props) => {
  const {
    i18n: { language },
    t,
  } = useTranslation();

  const license =
    podcast.copyright?.license &&
    getLicenseByAbbreviation(podcast.copyright?.license?.license, language);

  const image = podcast.podcastMeta?.image;

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

  const licenseCredits = getLicenseCredits(podcast.copyright);

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

  const id = podcast.id.toString();
  const figureId = `episode-${id}`;

  const imageId = `episode-${id}-image-${image?.id}`;

  return (
    <Figure id={figureId} type="full-column">
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
        <FigureLicenseDialog
          id={id}
          authors={podcastGroupedContributors}
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
            <SafeLinkButton to={podcast.audioFile.url} download outline>
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
            authors={imageContributors}>
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
              origin={image.copyright.origin}>
              {image.copyright.license?.license !== 'COPYRIGHTED' && (
                <>
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
                  <SafeLinkButton to={image.imageUrl} download outline>
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
