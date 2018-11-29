/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";

import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { PageContainer } from "@ndla/ui";
import { withApollo } from "react-apollo";
import { ArticleShape, ResourceTypeShape } from "../shapes";
import SearchContainer from "../containers/SearchPage/SearchContainer";
import ErrorPage from "../containers/ErrorPage/ErrorPage";

class LtiProvider extends React.Component {
  constructor(props) {
    super(props);
    this.location = null;
    this.state = {
      hasError: false,
      data: {
        loading: true,
        resourceTypes: [],
        subjects: []
      },
      location: null,
      searchObject: {
        contextFilters: [],
        languageFilter: [],
        levels: [],
        subjects: []
      }
    };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
    this.onSearchObjectChange = this.onSearchObjectChange.bind(this);
  }

  componentDidMount() {
    this.handleLoadInitialProps(this.props);
  }

  /*componentDidUpdate() {
    if (!this.state.data || this.state.data.loading === true) {
      this.handleLoadInitialProps(this.props);
    }
  }*/

  componentWillUnmount() {
    this.location = null;
  }

  onSearchObjectChange(updatedFields) {
    this.setState(prevState => ({
      searchObject: { ...prevState.searchObject, ...updatedFields }
    }));
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.location === null) {
      return {
        location: window.location
      };
    }
    const navigated = window.location !== prevState.location;
    if (navigated) {
      window.scrollTo(0, 0);
      return {
        hasError: false,
        data: { ...prevState.data, loading: true },
        location: window.location
      };
    }

    // No state update necessary
    return null;
  }*/

  componentDidCatch(error, info) {
    if (process.env.NODE_ENV === "production") {
      // React prints all errors that occurred during rendering to the console in development
      //handleError(error, info);
    }
    console.log(window.location);
    this.setState({ hasError: true });
  }

  async handleLoadInitialProps(props) {
    if (window.location === this.location) {
      // Data for this location is already loading
      return;
    }

    this.location = window.location;
    let data = [];
    console.log("DATA1", data);
    try {
      data = await SearchContainer.getInitialProps({
        client: this.props.client
      });
      console.log("DATA2", data);
    } catch (e) {
      //handleError(e);
    }
    console.log(window.location === this.location, this.location);
    // Only update state if on the same route
    if (window.location === this.location) {
      this.setState(prevState => ({
        data: { ...prevState.data, ...data.data, loading: false }
      }));
    }
  }

  render() {
    const {
      locale: { abbreviation: locale }
    } = this.props;
    const { hasError, searchObject } = this.state;
    if (hasError) {
      return <ErrorPage locale={locale} />;
    }
    console.log(this.props, "<-props    state->", this.state);
    return (
      <PageContainer>
        <Helmet htmlAttributes={{ lang: locale }} />
        {!this.state.data.loading && (
          <SearchContainer
            data={this.state.data}
            searchObject={searchObject}
            updateSearchLocation={this.onSearchObjectChange}
          />
        )}
      </PageContainer>
    );
  }
}

LtiProvider.propTypes = {
  locale: PropTypes.shape({
    abbreviation: PropTypes.string.isRequired,
    messages: PropTypes.object.isRequired
  }).isRequired,
  resource: PropTypes.shape({
    article: ArticleShape,
    resourceTypes: PropTypes.arrayOf(ResourceTypeShape)
  }),
  status: PropTypes.oneOf(["success", "error"])
};

export default withApollo(LtiProvider);
