/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { getSubjects } from './subjectSelectors';

class SubjectsContainer extends Component {
  componentWillMount() {

  }

  render() {
    return <div />;
  }
}

SubjectsContainer.propTypes = {
  subjects: PropTypes.array.isRequired,
};

const mapDispatchToProps = {

};


const mapStateToProps = state => ({
  subjects: getSubjects(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubjectsContainer);
