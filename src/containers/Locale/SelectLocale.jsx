/**
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory';

import { appLocales, isValidLocale } from '../../i18n';

class SelectLocale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: props.locale,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const { locale } = this.state;
    const { pathname } = window.location;

    let storedLocale = localStorage.getItem('client_language');

    // Only set nynorsk if browser is set to nynorsk, else default to nb
    if (!storedLocale) {
      if (locale === 'nn') {
        storedLocale = locale;
      } else {
        storedLocale = 'nb';
      }
      localStorage.setItem('client_language', storedLocale);
    }
    await this.setState({ locale: storedLocale });

    if (storedLocale !== 'nb' && !pathname.startsWith(`/${storedLocale}/`)) {
      this.handleChange(storedLocale);
    } else if (storedLocale === 'nb' && isValidLocale(pathname.split('/')[1])) {
      this.handleChange(storedLocale);
    }
  }

  handleChange = newLocale => {
    const { locale } = this.state;
    const { pathname, search } = window.location;
    const paths = pathname.split('/');

    let basePath;
    if (!isValidLocale(paths[1]) && locale === 'nb') {
      basePath = pathname;
    } else if (isValidLocale(paths[1]) && locale !== 'nb') {
      basePath = pathname.replace(`/${paths[1]}/`, '/');
    } else {
      basePath = pathname;
    }

    const newPath =
      newLocale === 'nb'
        ? `${basePath}${search}`
        : `/${newLocale}${basePath}${search}`;

    localStorage.setItem('client_language', newLocale);
    createHistory().push(newPath); // Need create new history or else basename is included
    window.location.reload();
  };

  render() {
    const { locale } = this.state;
    const { id } = this.props;

    return (
      <select
        onChange={evt => {
          this.handleChange(evt.target.value);
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
  }
}

SelectLocale.propTypes = {
  id: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }),
};

export default SelectLocale;
