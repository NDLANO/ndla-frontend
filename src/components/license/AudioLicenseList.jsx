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
import { AudioDocument } from '@ndla/icons/common';
import { getGroupedContributorDescriptionList } from '@ndla/licenses';
import { useTranslation } from 'react-i18next';
import CopyTextButton from './CopyTextButton';
import AnchorButton from './AnchorButton';
import { NewCopyrightObjectShape } from '../../shapes';

const AudioShape = PropTypes.shape({
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  copyright: NewCopyrightObjectShape.isRequired,
  copyText: PropTypes.string,
});

const AudioLicenseInfo = ({ audio, locale }) => {
  const {t} = useTranslation();
  const items = getGroupedContributorDescriptionList(audio.copyright, locale);
  return (
    <MediaListItem>
      <MediaListItemImage>
        <AudioDocument className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('license.audio.rules')}
        license={audio.copyright.license.license}
        resourceType="audio"
        resourceUrl={audio.src}
        locale={locale}>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              t={t}
              stringToCopy={audio.copyText}
              copyTitle={t('license.copyTitle')}
              hasCopiedTitle={t('license.hasCopiedTitle')}
            />
            <AnchorButton href={audio.src} download appearance="outline">
              {t('license.download')}
            </AnchorButton>
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

const AudioLicenseList = ({ audios, locale }) => { 
  const {t} = useTranslation();
  return (
  <div>
    <h2>{t('license.audio.heading')}</h2>
    <p>{t('license.audio.description')}</p>
    <MediaList>
      {audios.map(audio => (
        <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} />
      ))}
    </MediaList>
  </div>
  );
};

AudioLicenseList.propTypes = {
  locale: PropTypes.string.isRequired,
  audios: PropTypes.arrayOf(AudioShape).isRequired,
};

export default AudioLicenseList;
