/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from '@ndla/util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
  MediaListItemMeta,
} from '@ndla/ui';
import {
  metaTypes,
  getGroupedContributorDescriptionList,
} from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { CopyrightObjectShape } from '../../shapes';

const VideoShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  copyright: CopyrightObjectShape.isRequired,
  download: PropTypes.string.isRequired,
  iframe: PropTypes.shape({
    src: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
  }),
  copyText: PropTypes.string,
});

const VideoLicenseInfo = ({ video, locale}) => {
  const {t} = useTranslation();
  const items = getGroupedContributorDescriptionList(video.copyright, locale);
  if (video.title) {
    items.unshift({
      label: t('license.images.title'),
      description: video.title,
      metaType: metaTypes.title,
    });
  }
  return (
    <MediaListItem>
      <MediaListItemImage>
        <img alt="presentation" src={video.cover} />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.video.rules')}
        license={video.copyright.license.license}
        resourceType="video"
        resourceUrl={video.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={video.copyText}
              t={t}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            <AnchorButton href={video.download} download appearance="outline">
              {t('license.download')}
            </AnchorButton>

            <CopyTextButton
              stringToCopy={`<iframe title="${video.title}" height="${video.iframe.height}" aria-label="${video.title}" width="${video.iframe.width}" frameborder="0" src="${video.iframe.src}" allowfullscreen=""></iframe>`}
              t={t}
              copyTitle={t('license.embed')}
              hasCopiedTitle={t('license.embedCopied')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

VideoLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  video: VideoShape.isRequired,
};

const VideoLicenseList = ({ videos, locale}) => {
  const {t} = useTranslation();
  return (
  <div>
    <h2>{t('license.video.heading')}</h2>
    <p>{t('license.video.description')}</p>
    <MediaList>
      {videos.map(video => (
        <VideoLicenseInfo video={video} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
  );
};

VideoLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  videos: PropTypes.arrayOf(VideoShape).isRequired,
};

export default VideoLicenseList;
