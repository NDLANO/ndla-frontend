/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import * as actions from './searchActions';
import { getResults } from './searchSelectors';

class SearchPage extends Component {

  componentWillMount() {
    const { location: { query }, search } = this.props;
    search(query);
  }

  render() {
    const { results } = this.props;
    return (
      <div>
        <ul>
          { results.map(result => <li key={result.id}>{result.title}</li>)}
        </ul>
      </div>
    );
  }
}

SearchPage.propTypes = {
  location: PropTypes.shape({
    query: PropTypes.shape({
      query: PropTypes.string,
      page: PropTypes.string,
    }).isRequired,
  }).isRequired,
  results: PropTypes.array.isRequired,
  search: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  search: actions.search,
};

const mapStateToProps = (state) => ({
  results: getResults(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
