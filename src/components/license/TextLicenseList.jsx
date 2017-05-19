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
import { MediaList, MediaListItem, MediaListItemImage, MediaListItemBody, MediaListItemActions, MediaListItemMeta } from './MediaList';
import Icon from '../Icon';
import { CopyrightObjectShape } from '../../shapes';

const TextLicenseInfo = ({ text, locale }) => (
  <MediaListItem>
    <MediaListItemImage>
      <Icon.Document className="c-medialist__icon" />
    </MediaListItemImage>
    <MediaListItemBody license={text.copyright.license.license} title={text.title} locale={locale}>
      <MediaListItemActions>
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Copy className="c-modal__button-icon" /> Kopier referanse</button>
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Download className="c-modal__button-icon" /> Last ned</button>
      </MediaListItemActions>
      <MediaListItemMeta authors={text.copyright.authors} />
    </MediaListItemBody>
  </MediaListItem>
);

TextLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: CopyrightObjectShape,
};

const TextLicenseList = ({ texts, heading, description, locale }) => (
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <MediaList>
      { texts.map(text => <TextLicenseInfo text={text} key={uuid()} locale={locale} />) }
    </MediaList>
  </div>
);

TextLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(CopyrightObjectShape),
};

export default TextLicenseList;
