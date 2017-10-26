/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { uuid } from 'ndla-util';
import {
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListCCLink,
  MediaListItemActions,
  MediaListItemMeta,
} from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';

const VideoLicenseInfo = ({ video, locale, t }) => {
  const items = video.copyright.authors.map(author => ({
    label: author.type,
    description: author.name,
  }));
  return (
    <MediaListItem>
      <MediaListItemImage>
        <img
          alt="presentation"
          src={video.src}
          sizes="(min-width: 800px) 360px, (min-width: 600px) 300px, 100vw"
        />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.video.rules')}
        license={video.copyright.license.license}
        locale={locale}>
        <MediaListCCLink>{t('license.learnMore')}</MediaListCCLink>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              authors={video.copyright.authors}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

VideoLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  video: CopyrightObjectShape.isRequired,
};

const VideoLicenseList = ({ videos, heading, locale, t }) => (
  <div>
    <h2>{heading}</h2>
    <MediaList>
      {videos.map(video => (
        <VideoLicenseInfo video={video} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

VideoLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  videos: PropTypes.arrayOf(CopyrightObjectShape).isRequired,
};

export default injectT(VideoLicenseList);
