/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import { CompetenceGoalTab } from '@ndla/ui';
import { isValidElementType } from 'react-is';
import Spinner from '@ndla/ui/lib/Spinner';

import { useTranslation } from 'react-i18next';
import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import { ArticleShape, SubjectShape } from '../../shapes';

export function groupByCurriculums(competenceGoals, addUrl = false) {
  const searchUrl = '/search?grepCodes=';
  const curriculumsObject = competenceGoals.reduce((acc, goal) => {
    const curriculum = acc[goal.curriculum.id] || {
      id: goal.curriculum.id,
      title: `${goal.curriculum.title} (${goal.curriculum.id})`,
      elements: [],
    };
    const setTitle = goal.competenceGoalSet
      ? ` - ${goal.competenceGoalSet.title} (${goal.competenceGoalSet.id})`
      : '';

    return {
      ...acc,
      [goal.curriculum.id]: {
        ...curriculum,
        elements: [
          ...curriculum.elements,
          {
            id: goal.id,
            name: `${goal.name}${setTitle}`,
            text: goal.text,
            url: addUrl ? searchUrl + goal.id : '',
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
  language,
  wrapperComponent: Component,
  wrapperComponentProps,
}) => {
  const codes = article.grepCodes;
  const nodeId = article.oldNdlaUrl?.split('/').pop();
  const lang =
    article.supportedLanguages.find(l => l === language) ||
    article.supportedLanguages[0];
    const {t} = useTranslation();
  const { error, data, loading } = useQuery(competenceGoalsQuery, {
    variables: { codes, nodeId, language: lang },
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
    false,
  );
  const LK20Goals = groupByCurriculums(
    competenceGoals.filter(goal => goal.type === 'LK20'),
    false,
  );
  const LK20Elements = groupByCurriculums(coreElements || [], false);

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
  language: PropTypes.string,
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
