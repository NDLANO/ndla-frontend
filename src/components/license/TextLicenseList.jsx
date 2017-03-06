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

const TextLicenseInfo = ({ text, locale }) => (
  <li className="o-media c-medialist__item">
    <div className="o-media__img c-medialist__img">
      <Icon.Document className="c-medialist__icon" />
    </div>
    <div className="o-media__body c-medialist__body">
      {text.title ? <h3 className="c-medialist__title">{text.title} </h3> : null}
      <ClickableLicenseByline
        license={getLicenseByAbbreviation(text.copyright.license.license, locale)}
      />
      <div className="c-medialist__actions">
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Copy className="c-modal__button-icon" /> Kopier referanse</button>
        <button className="c-button c-button--small c-button--transparent" type="button"><Icon.Download className="c-modal__button-icon" /> Last ned</button>
      </div>
      <ul className="c-medialist__meta">
        { text.copyright.authors.map(author => <li key={uuid()} className="c-medialist__meta-item">{author.type}: {author.name}</li>)}
      </ul>
    </div>
  </li>
);

TextLicenseInfo.propTypes = {
  locale: PropTypes.string.isRequired,
  text: CopyrightObjectShape,
};

const TextLicenseList = ({ texts, heading, description, locale }) => (
  <div>
    <h2>{heading}</h2>
    <p>{description}</p>
    <ul className="c-medialist">
      { texts.map(text => <TextLicenseInfo text={text} key={uuid()} locale={locale} />) }
    </ul>
  </div>
);

TextLicenseList.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  texts: PropTypes.arrayOf(CopyrightObjectShape),
};

export default TextLicenseList;
