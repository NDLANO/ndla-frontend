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
import { getSubjects } from './subjectSelectors';

class SubjectMenu extends Component {
  componentWillMount() {
    this.props.fetchSubjects();
  }

  render() {
    const { subjects } = this.props;
    return (
      <div>
        <ul>
          { subjects.map(subject => <li key={subject.id}>{ subject.name }</li>) }
        </ul>
      </div>
    );
  }
}

SubjectMenu.propTypes = {
  subjects: PropTypes.array.isRequired,
  fetchSubjects: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  fetchSubjects: actions.fetchSubjects,
};


const mapStateToProps = state => ({
  subjects: getSubjects(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubjectMenu);
