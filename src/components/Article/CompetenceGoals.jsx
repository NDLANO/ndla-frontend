/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { CompetenceGoalList, CompetenceGoalListHeading } from '@ndla/ui';
import { isValidElementType } from 'react-is';
import Spinner from '@ndla/ui/lib/Spinner';

import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import { ArticleShape } from '../../shapes';

export function groupByCurriculums(competenceGoals) {
  const curriculumsObject = competenceGoals.reduce((acc, goal) => {
    const curriculum = acc[goal.curriculum.id] || {
      id: goal.curriculum.id,
      title: goal.curriculum.title,
      goals: [],
    };

    return {
      ...acc,
      [goal.curriculum.id]: {
        ...curriculum,
        goals: [...curriculum.goals, { id: goal.id, name: goal.title }],
      },
    };
  }, {});

  return Object.keys(curriculumsObject).map(key => curriculumsObject[key]);
}

const CompetenceGoals = ({
  article,
  wrapperComponent: Component,
  wrapperComponentProps,
}) => {
  const codes = article.grepCodes;
  const { error, data, loading } = useQuery(competenceGoalsQuery, {
    variables: { codes },
  });
  if (error) {
    handleError(error);
    return null;
  }

  if (loading) {
    return <Spinner />;
  }
  const curriculums = groupByCurriculums(data.competenceGoals);
  return (
    <Component {...wrapperComponentProps}>
      {curriculums.map(curriculum => (
        <Fragment key={curriculum.id}>
          <CompetenceGoalListHeading>
            {curriculum.title}:
          </CompetenceGoalListHeading>
          <CompetenceGoalList goals={curriculum.goals} />
        </Fragment>
      ))}
    </Component>
  );
};

CompetenceGoals.propTypes = {
  article: ArticleShape,
  wrapperComponent: (props, propName) => {
    if (props[propName] && !isValidElementType(props[propName])) {
      return new Error(
        `Invalid prop 'component' supplied to 'CompetenceGoals': the prop is not a valid React component`,
      );
    }
    return null;
  },
  wrapperComponentProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default CompetenceGoals;
