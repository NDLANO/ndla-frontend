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
  MediaListItemActions,
  MediaListItemMeta,
} from 'ndla-ui';
import { Audio } from 'ndla-icons/common';
import { injectT } from 'ndla-i18n';
import { getGroupedContributorDescriptionList } from 'ndla-licenses';
import CopyTextButton from './CopyTextButton';
import { NewCopyrightObjectShape } from '../../shapes';
import { getCopyrightCopyString } from './getCopyrightCopyString';

const AudioShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  copyright: NewCopyrightObjectShape.isRequired,
});

const AudioLicenseInfo = ({ audio, locale, t }) => {
  const items = getGroupedContributorDescriptionList(audio.copyright, locale);
  return (
    <MediaListItem>
      <MediaListItemImage>
        <Audio className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('audio.rules')}
        license={audio.copyright.license.license}
        resourceType="audio"
        resourceUrl={audio.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              t={t}
              stringToCopy={getCopyrightCopyString(audio.copyright, t)}
              copyTitle={t('copyTitle')}
              hasCopiedTitle={t('hasCopiedTitle')}
            />
            <a
              href={audio.src}
              className="c-button c-button--outline c-licenseToggle__button"
              download>
              {t('download')}
            </a>
          </div>
        </MediaListItemActions>
      </MediaListItemBody>
    </MediaListItem>
  );
};

AudioLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  audio: AudioShape.isRequired,
};

const AudioLicenseList = ({ audios, locale, t }) => (
  <div>
    <h2>{t('audio.heading')}</h2>
    <p>{t('audio.description')}</p>
    <MediaList>
      {audios.map(audio => (
        <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

AudioLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  audios: PropTypes.arrayOf(AudioShape).isRequired,
};

export default injectT(AudioLicenseList, 'license.');
