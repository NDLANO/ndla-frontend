/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { CompetenceGoalTab } from '@ndla/ui';
import { isValidElementType } from 'react-is';
import Spinner from '@ndla/ui/lib/Spinner';

import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import { ArticleShape, SubjectShape } from '../../shapes';

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
  subject,
  wrapperComponent: Component,
  wrapperComponentProps,
}) => {
  const codes = article.grepCodes;
  const competenceCodes = codes?.filter(code => code.startsWith('KM'));
  const coreCodes = codes?.filter(code => code.startsWith('KE'));
  const nodeId = article.oldNdlaUrl?.split('/').pop();
  const { error, data, loading } = useQuery(competenceGoalsQuery, {
    variables: { competenceCodes, coreCodes, nodeId },
  });
  if (error) {
    handleError(error);
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  const { competenceGoals, oldCompetenceGoals, coreElements } = data;

  const competenceGoalsList = [
    ...(oldCompetenceGoals
      ? [
          {
            id: '1',
            type: 'LK06',
            goals: oldCompetenceGoals,
          },
        ]
      : []),
    ...(competenceGoals
      ? [
          {
            id: '2',
            type: 'LK20',
            goals: competenceGoals,
          },
        ]
      : []),
    ...(coreElements
      ? [
          {
            id: '3',
            type: 'coreElement',
            coreItems: coreElements,
          },
        ]
      : []),
  ];

  return (
    <Component {...wrapperComponentProps}>
      <CompetenceGoalTab title={subject?.name} list={competenceGoalsList} />
    </Component>
  );
};

CompetenceGoals.propTypes = {
  article: ArticleShape,
  subject: SubjectShape,
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
