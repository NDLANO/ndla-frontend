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
import { injectT } from '@ndla/i18n';
import { getGroupedContributorDescriptionList } from '@ndla/licenses';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { CopyrightObjectShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const VideoShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  copyright: CopyrightObjectShape.isRequired,
});

const VideoLicenseInfo = ({ video, locale, t }) => {
  const items = getGroupedContributorDescriptionList(video.copyright, locale);
  return (
    <MediaListItem>
      <MediaListItemImage>
        <img alt="presentation" src={video.cover} />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('video.rules')}
        license={video.copyright.license.license}
        resourceType="video"
        resourceUrl={video.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              stringToCopy={getCopyrightCopyString(video.copyright, t)}
              t={t}
              copyTitle={t('copyTitle')}
              hasCopiedTitle={t('hasCopiedTitle')}
            />
            <AnchorButton href={video.src} download appearance="outline">
              {t('download')}
            </AnchorButton>

            <CopyTextButton
              stringToCopy={`<iframe title="${video.title}" height="${video.iframe.height}" aria-label="${video.title}" width="${video.iframe.width}" frameborder="0" src="${video.iframe.src}" allowfullscreen=""></iframe>`}
              t={t}
              copyTitle={t('embed')}
              hasCopiedTitle={t('embedCopied')}
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

const VideoLicenseList = ({ videos, locale, t }) => (
  <div>
    <h2>{t('video.heading')}</h2>
    <p>{t('video.description')}</p>
    <MediaList>
      {videos.map(video => (
        <VideoLicenseInfo video={video} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

VideoLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  videos: PropTypes.arrayOf(VideoShape).isRequired,
};

export default injectT(VideoLicenseList, 'license.');
