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
} from 'ndla-ui';
import { MediaListItemMeta } from './MediaList';
import CopyTextButton from './CopyTextButton';
import Icon from '../Icon';
import { CopyrightObjectShape } from '../../shapes';

const AudioLicenseInfo = ({ audio, locale }) =>
  <MediaListItem>
    <MediaListItemImage>
      <Icon.Audio className="c-medialist__icon" />
    </MediaListItemImage>
    <MediaListItemBody
      license={audio.copyright.license.license}
      title="Regler for bruk av lydfilen:"
      locale={locale}>
      <MediaListItemActions>
        <h3 className="c-medialist__title">
          Slik skal du referere til lydfilen:
        </h3>
        <MediaListItemMeta authors={audio.copyright.authors} />
        <CopyTextButton
          authors={audio.copyright.authors}
          copyTitle="Kopier referanse"
          hasCopiedTitle="Kopiert!"
        />
        <a
          href={audio.src}
          className="c-button c-button--outline c-licenseToggle__button"
          download>
          Last ned
        </a>
      </MediaListItemActions>
    </MediaListItemBody>
  </MediaListItem>;

AudioLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  audio: CopyrightObjectShape.isRequired,
};

const AudioLicenseList = ({ audios, heading, locale }) =>
  <div>
    <h2>{heading}</h2>
    <MediaList>
      {audios.map(audio =>
        <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} />,
      )}
    </MediaList>
  </div>;

AudioLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  audios: PropTypes.arrayOf(CopyrightObjectShape).isRequired,
};

export default AudioLicenseList;
