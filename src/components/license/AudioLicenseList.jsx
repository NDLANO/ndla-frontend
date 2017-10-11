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
import { Audio } from 'ndla-ui/icons';
import { injectT } from 'ndla-i18n';
import CopyTextButton from './CopyTextButton';
import { CopyrightObjectShape } from '../../shapes';

const AudioLicenseInfo = ({ audio, locale, t }) => {
  const items = audio.copyright.authors.map(author => ({
    label: author.type,
    description: author.name,
  }));
  return (
    <MediaListItem>
      <MediaListItemImage>
        <Audio className="c-medialist__icon" />
      </MediaListItemImage>
      <MediaListItemBody
        title={t('rules')}
        license={audio.copyright.license.license}
        locale={locale}>
        <MediaListCCLink>{t('learnMore')}</MediaListCCLink>
        <MediaListItemActions>
          <div className="c-medialist__ref">
            <MediaListItemMeta items={items} />
            <CopyTextButton
              authors={audio.copyright.authors}
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
  audio: CopyrightObjectShape.isRequired,
};

const AudioLicenseList = ({ audios, heading, locale, t }) => (
  <div>
    <h2>{heading}</h2>
    <MediaList>
      {audios.map(audio => (
        <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} t={t} />
      ))}
    </MediaList>
  </div>
);

AudioLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  audios: PropTypes.arrayOf(CopyrightObjectShape).isRequired,
};

export default injectT(AudioLicenseList, 'license.audios.');
