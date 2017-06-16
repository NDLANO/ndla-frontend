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
  Button,
  MediaList,
  MediaListItem,
  MediaListItemImage,
  MediaListItemBody,
  MediaListItemActions,
} from 'ndla-ui';
import { MediaListItemMeta } from './MediaList';
import Icon from '../Icon';
import { CopyrightObjectShape } from '../../shapes';

const TextLicenseInfo = ({ text, locale }) =>
  <MediaListItem>
    <MediaListItemImage>
      <Icon.Document className="c-medialist__icon" />
    </MediaListItemImage>
    <MediaListItemBody
      license={text.copyright.license.license}
      title="Regler for bruk av teksten:"
      locale={locale}>
      <MediaListItemActions>
        <h3 className="c-medialist__title">
          Slik skal du referere til teksten:
        </h3>
        <MediaListItemMeta authors={text.copyright.authors} />
        <Button outline className="c-licenseToggle__button">
          Kopier referanse
        </Button>
        <Button outline className="c-licenseToggle__button">
          Last ned
        </Button>
      </MediaListItemActions>
    </MediaListItemBody>
  </MediaListItem>;

TextLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: CopyrightObjectShape,
};

const TextLicenseList = ({ texts, heading, description, locale }) =>
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <MediaList>
      {texts.map(text =>
        <TextLicenseInfo text={text} key={uuid()} locale={locale} />,
      )}
    </MediaList>
  </div>;

TextLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(CopyrightObjectShape),
};

export default TextLicenseList;
