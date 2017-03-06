/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { uuid } from 'ndla-util';
import { ClickableLicenseByline } from 'ndla-ui';
import getLicenseByAbbreviation from 'ndla-licenses';
import Icon from '../Icon';
import { CopyrightObjectShape } from '../../shapes';

const ImageLicenseInfo = ({ image, locale }) => (
  <li className="o-media c-medialist__item">
    <div className="o-media__img c-medialist__img">
      <img width="260" alt={image.altText} src={`${image.src}?width=260`} />
    </div>
    <div className="o-media__body c-medialist__body">
      <ClickableLicenseByline
        license={getLicenseByAbbreviation(image.copyright.license.license, locale)}
      />
      <div className="c-medialist__actions">
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Copy className="c-modal__button-icon" /> Kopier referanse</button>
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Link className="c-modal__button-icon" /> Gå til kilde</button>
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.OpenWindow className="c-modal__button-icon" /> Vis bilde</button>
      </div>
      <ul className="c-medialist__meta">
        { image.copyright.authors.map(author => <li key={uuid()} className="c-medialist__meta-item">{author.type}: {author.name}</li>)}
      </ul>
    </div>
  </li>
);

ImageLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  image: PropTypes.shape({
    src: PropTypes.string.isRequired,
    copyright: PropTypes.shape({
      authors: PropTypes.array.isRequired,
      lisence: PropTypes.shape({
        license: PropTypes.string.isRequired,
      }),
    }),
  }),
};

const ImageLicenseList = ({ images, heading, description, locale }) => (
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <ul className="c-medialist">
      { images.map(image => <ImageLicenseInfo image={image} key={uuid()} locale={locale} />) }
    </ul>
  </div>
);

ImageLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(CopyrightObjectShape),
};

export default ImageLicenseList;
