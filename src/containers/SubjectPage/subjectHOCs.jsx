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
import gql from 'graphql-tag';
import { SubjectShape, GraphqlErrorShape } from '../../shapes';
import { subjectInfoFragment } from '../../fragments';

export const query = gql`
  ${subjectInfoFragment}

  query subjects {
    subjects {
      ...SubjectInfo
    }
  }
`;

export const injectSubjects = WrappedComponent => {
  class SubjectsContainer extends Component {
    static getInitialProps(ctx) {
      return ctx.client.query({
        errorPolicy: 'all',
        query,
      });
    }

    render() {
      const { loading, errors } = this.props;
      if (loading !== false) {
        return null;
      }

      const data = defined(this.props.data, {});
      const subjects = data.subjects || [];
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
