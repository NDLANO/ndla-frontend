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
import BEMHelper from 'react-bem-helper';

const oClasses = new BEMHelper({
  name: 'media',
  prefix: 'o-',
});

const cClasses = new BEMHelper({
  name: 'medialist',
  prefix: 'c-',
});


export const MediaList = ({ children }) =>
  <ul {...cClasses()}>
    {children}
  </ul>;

export const MediaListItem = ({ children }) =>
  <li {...oClasses(null, null, cClasses().className)}>
    {children}
  </li>;

export const MediaListItemImage = ({ children }) =>
  <div {...oClasses('img', null, cClasses('img').className)}>
    {children}
  </div>;

export const MediaListItemBody = ({ children, license, title, locale }) =>
  <div {...oClasses('body', null, cClasses('body').className)}>
    { title ? <h3 className="c-medialist__title">{title} </h3> : null}
    <ClickableLicenseByline
      license={getLicenseByAbbreviation(license, locale)}
    />
    {children}
  </div>;

MediaListItemBody.propTypes = {
  children: PropTypes.node.isRequired,
  license: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  title: PropTypes.string,
};

export const MediaListItemActions = ({ children }) =>
  <div {...cClasses('actions')}>
    {children}
  </div>;

export const MediaListItemMeta = ({ authors }) =>
  <ul {...cClasses('actions')}>
    { authors.map(author => <li key={uuid()} className="c-medialist__meta-item">{author.type}: {author.name}</li>)}
  </ul>;

MediaListItemMeta.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};
