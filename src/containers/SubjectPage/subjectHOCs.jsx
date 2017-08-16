/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions, getSubjects, hasFetchSubjectsFailed } from './subjects';
import { SubjectShape } from '../../shapes';

export const injectSubjects = WrappedComponent => {
  class SubjectsContainer extends Component {
    componentWillMount() {
      this.props.fetchSubjects();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  SubjectsContainer.propTypes = {
    subjects: PropTypes.arrayOf(SubjectShape).isRequired,
    hasFailed: PropTypes.bool.isRequired,
    fetchSubjects: PropTypes.func.isRequired,
  };

  const mapDispatchToProps = {
    fetchSubjects: actions.fetchSubjects,
  };

  const mapStateToProps = state => ({
    subjects: getSubjects(state),
    hasFailed: hasFetchSubjectsFailed(state),
  });

  const getDisplayName = component =>
    component.displayName || component.name || 'Component';

  SubjectsContainer.displayName = `InjectSubjects(${getDisplayName(
    WrappedComponent,
  )})`;

  return connect(mapStateToProps, mapDispatchToProps)(SubjectsContainer);
};
