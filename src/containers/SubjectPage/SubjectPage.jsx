/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import * as actions from './subjectActions';

class SubjectPage extends Component {
  componentWillMount() {
    const { params: { subjectId }, fetchTopics } = this.props;
    fetchTopics(subjectId);
  }

  render() {
    const { params: { subjectId } } = this.props;
    return (
      <h1>{subjectId}</h1>
    );
  }
}

SubjectPage.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string.isRequired,
  }).isRequired,
  fetchTopics: PropTypes.func.isRequired,
  // subject: PropTypes.shape({
  //   id: PropTypes.string.isRequired,
  // }),
};

const mapDispatchToProps = {
  fetchTopics: actions.fetchTopics,
};

// const makeMapStateToProps = (_, ownProps) => {
//   const subjectId = ownProps.params.subjectId;
//   const getSubjectSelector = getSubject(subjectId);
//   return state => ({
//     subject: getSubjectSelector(state),
//    });
//   }

export default connect(state => state, mapDispatchToProps)(SubjectPage);
