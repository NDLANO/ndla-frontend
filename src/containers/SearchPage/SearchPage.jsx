/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component, Fragment } from 'react';
import { func, number, string, shape } from 'prop-types';
import { compose } from 'redux';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { withRouter } from 'react-router-dom';
import { LocationShape } from '../../shapes';
import SearchContainer from './SearchContainer';
import {
  converSearchStringToObject,
  convertSearchParam,
} from './searchHelpers';

class SearchPage extends Component {
  static getInitialProps = ctx => SearchContainer.getInitialProps(ctx);

  updateSearchLocation = searchParams => {
    const { history, location } = this.props;
    const stateSearchParams = {};
    Object.keys(searchParams).forEach(key => {
      stateSearchParams[key] = convertSearchParam(searchParams[key]);
    });

    history.push({
      pathname: '/search',
      search: queryString.stringify({
        ...queryString.parse(location.search),
        ...stateSearchParams,
      }),
    });
  };

  render() {
    const { location, t, ...rest } = this.props;
    const searchObject = converSearchStringToObject(location);
    const locationSearchParams = queryString.parse(location.search);
    return (
      <Fragment>
        <HelmetWithTracker title={t('htmlTitles.searchPage')} />
        <SearchContainer
          searchObject={searchObject}
          locationSearchParams={locationSearchParams}
          updateSearchLocation={this.updateSearchLocation}
          {...rest}
        />
      </Fragment>
    );
  }
}

SearchPage.propTypes = {
  location: LocationShape,
  history: shape({
    push: func.isRequired,
  }).isRequired,
  resultMetadata: shape({
    totalCount: number,
    lastPage: number,
  }),
  match: shape({
    params: shape({
      subjectId: string,
    }),
  }),
};

export default compose(
  injectT,
  withRouter,
)(SearchPage);
