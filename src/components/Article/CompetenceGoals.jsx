/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
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
      title: `${goal.curriculum.title} (${goal.curriculum.id})`,
      elements: [],
    };

    return {
      ...acc,
      [goal.curriculum.id]: {
        ...curriculum,
        elements: [
          ...curriculum.elements,
          {
            id: goal.id,
            name: goal.name,
            text: goal.text,
          },
        ],
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
  t,
}) => {
  const codes = article.grepCodes;
  const nodeId = article.oldNdlaUrl?.split('/').pop();
  const { error, data, loading } = useQuery(competenceGoalsQuery, {
    variables: { codes, nodeId },
  });

  if (error) {
    handleError(error);
    return null;
  }

  if (loading) {
    return <Spinner />;
  }

  const { competenceGoals, coreElements } = data;
  const LK06Goals = groupByCurriculums(
    competenceGoals.filter(goal => goal.type === 'LK06'),
  );
  const LK20Goals = groupByCurriculums(
    competenceGoals.filter(goal => goal.type === 'LK20'),
  );
  const LK20Elements = groupByCurriculums(coreElements || []);

  const competenceGoalsList = [
    ...(LK20Goals?.length
      ? [
          {
            id: '1',
            title: t('competenceGoals.competenceTabLK20label'),
            type: 'competenceGoals',
            groupedCompetenceGoals: LK20Goals,
          },
        ]
      : []),
    ...(LK20Elements?.length
      ? [
          {
            id: '2',
            title: t('competenceGoals.competenceTabCorelabel'),
            type: 'coreElement',
            groupedCoreElementItems: LK20Elements,
          },
        ]
      : []),
    ...(LK06Goals?.length
      ? [
          {
            id: '3',
            title: t('competenceGoals.competenceTabLK06label'),
            type: 'competenceGoals',
            groupedCompetenceGoals: LK06Goals,
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

export default injectT(CompetenceGoals);
