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
} from './MediaList';
import Icon from '../Icon';
import { CopyrightObjectShape } from '../../shapes';

const ImageLicenseInfo = ({ image, locale }) =>
  <MediaListItem>
    <MediaListItemImage>
      <img width="260" alt={image.altText} src={`${image.src}?width=260`} />
    </MediaListItemImage>
    <MediaListItemBody
      license={image.copyright.license.license}
      locale={locale}>
      <MediaListItemActions>
        <button
          className="c-button c-button--small c-button--transparent"
          type="button">
          <Icon.Copy className="c-modal__button-icon" /> Kopier referanse
        </button>
        <a
          href={image.src}
          className="c-button c-button--small c-button--transparent">
          <Icon.Link className="c-modal__button-icon" /> Gå til kilde
        </a>
        <button
          className="c-button c-button--small c-button--transparent"
          type="button">
          <Icon.OpenWindow className="c-modal__button-icon" /> Vis bilde
        </button>
      </MediaListItemActions>
      <MediaListItemMeta authors={image.copyright.authors} />
    </MediaListItemBody>
  </MediaListItem>;

ImageLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  image: CopyrightObjectShape.isRequired,
};

const ImageLicenseList = ({ images, heading, description, locale }) =>
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <MediaList>
      {images.map(image =>
        <ImageLicenseInfo image={image} key={uuid()} locale={locale} />,
      )}
    </MediaList>
  </div>;

ImageLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(CopyrightObjectShape),
};

export default ImageLicenseList;
