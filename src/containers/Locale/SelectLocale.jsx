/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

import { appLocales } from '../../i18n';

const SelectLocale = ({ locale, id }) => {
  const handleChange = newLocale => {
    const { pathname, search } = window.location;
    const basePath = pathname.startsWith(`/${locale}/`)
      ? pathname.replace(`/${locale}/`, '/')
      : pathname;
    const newPath =
      newLocale === 'nb'
        ? `${basePath}${search}`
        : `/${newLocale}${basePath}${search}`;
    createHistory().push(newPath); // Need create new history or else basename is included
    window.location.reload();
  };
  return (
    <select
      onChange={evt => {
        handleChange(evt.target.value);
      }}
      data-testid="language-select"
      // autoComplete="off" is need to make the selected attribute work in firefox
      autoComplete="off"
      value={locale}
      id={id}>
      {appLocales.map(l => (
        <option key={l.abbreviation} value={l.abbreviation}>
          {l.name}
        </option>
      ))}
    </select>
  );
};

SelectLocale.propTypes = {
  id: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }),
};

export default SelectLocale;
