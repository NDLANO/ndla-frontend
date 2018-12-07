/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectT } from '@ndla/i18n';
import { withApollo } from 'react-apollo';
import { ArticleShape, ResourceTypeShape } from '../shapes';
import SearchContainer from '../containers/SearchPage/SearchContainer';
import { resultsWithContentTypeBadgeAndImage } from '../containers/SearchPage/searchHelpers';
import ErrorPage from '../containers/ErrorPage/ErrorPage';
import handleError from '../util/handleError';
import LtiSearchResultList from './LtiSearchResultList';

class LtiProvider extends React.Component {
  constructor(props) {
    super(props);
    this.location = null;
    this.state = {
      hasError: false,
      data: {
        loading: true,
        resourceTypes: [],
        subjects: [],
      },
      location: null,
      searchObject: {
        contextFilters: [],
        languageFilter: [],
        resourceTypes: '',
        levels: [],
        subjects: [],
        page: '1',
      },
    };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
    this.onSearchObjectChange = this.onSearchObjectChange.bind(this);
    this.getResultComponent = this.getResultComponent.bind(this);
  }

  componentDidMount() {
    this.handleLoadInitialProps(this.props);
  }

  componentDidUpdate() {
    const { data } = this.state;
    if (!data || data.loading === true) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentWillUnmount() {
    this.location = null;
  }

  onSearchObjectChange(updatedFields) {
    this.setState(prevState => ({
      searchObject: {
        ...prevState.searchObject,
        ...updatedFields,
        page: updatedFields.page
          ? updatedFields.page.toString()
          : prevState.searchObject.page,
      },
    }));
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location === null) {
      return {
        location: window.location,
      };
    }
    const navigated = window.location !== prevState.location;
    if (navigated) {
      window.scrollTo(0, 0);
      return {
        hasError: false,
        data: { ...prevState.data, loading: true },
        location: window.location,
      };
    }

    // No state update necessary
    return null;
  }

  getResultComponent(results, enabledTab) {
    const { t, ltiData } = this.props;
    return (
      <LtiSearchResultList
        messages={{
          subjectsLabel: t('searchPage.searchResultListMessages.subjectsLabel'),
          noResultHeading: t(
            'searchPage.searchResultListMessages.noResultHeading',
          ),
          noResultDescription: t(
            'searchPage.searchResultListMessages.noResultDescription',
          ),
        }}
        ltiData={ltiData}
        results={
          results && resultsWithContentTypeBadgeAndImage(results, t, enabledTab)
        }
      />
    );
  }

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === 'production') {
      // React prints all errors that occurred during rendering to the console in development
      handleError(error, info);
    }
    this.setState({ hasError: true });
  }

  async handleLoadInitialProps(props) {
    if (window.location === this.location) {
      // Data for this location is already loading
      return;
    }

    this.location = window.location;
    const { client } = props;
    let data = [];
    try {
      data = await SearchContainer.getInitialProps({
        client,
      });
    } catch (e) {
      handleError(e);
    }

    // Only update state if on the same route
    if (window.location === this.location) {
      const filtredResourceTypes = data.data.resourceTypes.filter(
        type => type.id !== 'urn:resourcetype:learningPath',
      );
      this.setState(prevState => ({
        searchObject: {
          ...prevState.searchObject,
        },
        data: {
          ...prevState.data,
          ...data.data,
          resourceTypes: filtredResourceTypes,
          loading: false,
        },
      }));
    }
  }

  render() {
    const {
      locale: { abbreviation: locale },
    } = this.props;
    const { hasError, searchObject, data } = this.state;

    if (hasError) {
      return <ErrorPage locale={locale} />;
    }

    return (
      <div>
        <Helmet htmlAttributes={{ lang: locale }} />
        {!data.loading && (
          <SearchContainer
            data={data}
            searchObject={searchObject}
            updateSearchLocation={this.onSearchObjectChange}
            customResultList={this.getResultComponent}
          />
        )}
      </div>
    );
  }
}

LtiProvider.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired,
  }).isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape),
  }),
  status: PropTypes.oneOf(['success', 'error']),
  ltiData: PropTypes.shape({
    launch_presentation_return_url: PropTypes.string,
    launch_presentation_document_target: PropTypes.string,
  }),
};

export default injectT(withApollo(LtiProvider));
