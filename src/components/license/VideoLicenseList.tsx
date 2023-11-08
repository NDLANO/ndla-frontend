/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { uuid } from '@ndla/util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
  ItemType,
} from '@ndla/ui';
import { SafeLinkButton } from '@ndla/safelink';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import uniqBy from 'lodash/uniqBy';
import CopyTextButton from './CopyTextButton';
import { GQLVideoLicenseList_BrightcoveLicenseFragment } from '../../graphqlTypes';
import {
  isCopyrighted,
  licenseCopyrightToCopyrightType,
} from './licenseHelpers';
import { licenseListCopyrightFragment } from './licenseFragments';
import LicenseDescription from './LicenseDescription';

interface VideoLicenseInfoProps {
  video: GQLVideoLicenseList_BrightcoveLicenseFragment;
}

const VideoLicenseInfo = ({ video }: VideoLicenseInfoProps) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const pageUrl = useMemo(() => `/video/${video.id}`, [video.id]);

  const shouldShowLink = useMemo(
    () =>
      pathname !== pageUrl && !isCopyrighted(video.copyright?.license.license),
    [pageUrl, pathname, video.copyright?.license.license],
  );

  const safeCopyright = licenseCopyrightToCopyrightType(video.copyright);
  const items: ItemType[] = getGroupedContributorDescriptionList(
    safeCopyright,
    i18n.language,
  );
  if (video.title) {
    items.unshift({
      label: t('license.images.title'),
      description: video.title,
      metaType: metaTypes.title,
    });
  }
  return (
    <MediaListItem>
      <MediaListItemImage canOpen={shouldShowLink}>
        {!shouldShowLink ? (
          <img alt="presentation" src={video.cover} />
        ) : (
          <Link
            to={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('embed.goTo', { type: t('embed.type.video') })}
          >
            <img alt="presentation" src={video.cover} />
          </Link>
        )}
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.video.rules')}
        license={video.copyright?.license?.license ?? ''}
        resourceType="video"
        resourceUrl={video.src}
        locale={i18n.language}
      >
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            {video.copyright?.license?.license !== 'COPYRIGHTED' &&
              video.download && (
                <SafeLinkButton to={video.download} download variant="outline">
                  {t('license.download')}
                </SafeLinkButton>
              )}
            <CopyTextButton
              stringToCopy={`<iframe title="${video.title}" height="${video.iframe?.height}" aria-label="${video.title}" width="${video.iframe?.width}" frameborder="0" src="${video.iframe?.src}" allowfullscreen=""></iframe>`}
              copyTitle={t('license.embed')}
              hasCopiedTitle={t('license.embedCopied')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

interface Props {
  videos: GQLVideoLicenseList_BrightcoveLicenseFragment[];
}

const VideoLicenseList = ({ videos }: Props) => {
  const { t } = useTranslation();
  const unique = useMemo(() => uniqBy(videos, (video) => video.id), [videos]);
  return (
    <div>
      <LicenseDescription>{t('license.video.description')}</LicenseDescription>
      <MediaList>
        {unique.map((video) => (
          <VideoLicenseInfo video={video} key={uuid()} />
        ))}
      </MediaList>
    </div>
  );
};

VideoLicenseList.fragments = {
  video: gql`
    fragment VideoLicenseList_BrightcoveLicense on BrightcoveLicense {
      id
      title
      download
      src
      cover
      iframe {
        width
        height
        src
      }
      copyright {
        ...LicenseListCopyright
      }
    }
    ${licenseListCopyrightFragment}
  `,
};

export default VideoLicenseList;
