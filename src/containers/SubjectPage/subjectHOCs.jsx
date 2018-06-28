/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defined from 'defined';
import { SubjectShape } from '../../shapes';
import { subjectsQuery } from '../../queries';
import config from '../../config';
import { GraphqlErrorShape } from '../../graphqlShapes';
import { runQueries } from '../../util/runQueries';
import handleError from '../../util/handleError';

export const injectSubjects = WrappedComponent => {
  class SubjectsContainer extends Component {
    static async getInitialProps(ctx) {
      try {
        return runQueries(ctx.client, [{ query: subjectsQuery }]);
      } catch (e) {
        handleError(e);
        return null;
      }
    }

    render() {
      const { loading, errors } = this.props;
      if (loading !== false) {
        return null;
      }

      const data = defined(this.props.data, {});
      // Quick fix for removing MK subject in prod
      const subjects = (data.subjects || []).filter(subject => {
        if (config.isNdlaProdEnvironment) {
          return subject.id !== 'urn:subject:1';
        }
        return true;
      });

      const hasFailed = errors !== undefined && errors.length > 0;
      return (
        <WrappedComponent
          {...this.props}
          subjects={subjects}
          hasFailed={hasFailed}
        />
      );
    }
  }

  SubjectsContainer.propTypes = {
    data: PropTypes.shape({
      subjects: PropTypes.arrayOf(SubjectShape),
    }),
    errors: PropTypes.arrayOf(GraphqlErrorShape),
    loading: PropTypes.bool,
  };

  const getDisplayName = component =>
    component.displayName || component.name || 'Component';

  SubjectsContainer.displayName = `InjectSubjects(${getDisplayName(
    WrappedComponent,
  )})`;

  return SubjectsContainer;
};
