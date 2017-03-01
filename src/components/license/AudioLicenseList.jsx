/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import getLicenseByAbbreviation from 'ndla-licenses';
import { Icon } from 'ndla-ui';
import { uuid } from 'ndla-util';
import LicenseByline from './LicenseByline';

const AudioLicenseInfo = ({ audio, locale }) => (
  <li className="license__list-item">
    <LicenseByline
      license={getLicenseByAbbreviation(audio.copyright.license.license, locale)}
      locale={locale}
    >
      <i>{audio.title} </i>
      { audio.copyright.authors.map(author => author.name).join(', ') }
    </LicenseByline>
    <a href={audio.src} download><Icon.Download /></a>
  </li>
);

AudioLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  audio: PropTypes.shape({
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
      lisence: PropTypes.shape({
        license: PropTypes.string.isRequired,
      }),
    }),
  }),
};

const AudioLicenseList = ({ audios, heading, locale }) => (
  <div>
    <h2>{heading}</h2>
    <ul className="license__list">
      <li className="license__list-item">
        <ul className="license__list">
          { audios.map(audio => <AudioLicenseInfo audio={audio} key={uuid()} locale={locale} />) }
        </ul>
      </li>
    </ul>
  </div>
);

AudioLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  audios: PropTypes.array.isRequired,
};

export default AudioLicenseList;
