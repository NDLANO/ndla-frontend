/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { CompetenceGoalList, CompetenceGoalListHeading } from '@ndla/ui';
import { competenceGoalsQuery } from '../../queries';
import handleError from '../../util/handleError';
import { ArticleShape } from '../../shapes';

function groupByCurriculums(competenceGoals) {
  const curriculumsObject = competenceGoals.reduce((acc, goal) => {
    const curriculum = acc[goal.curriculum.id] || {
      id: goal.curriculum.id,
      name: goal.curriculum.name,
      goals: [],
    };

    return {
      ...acc,
      [goal.curriculum.id]: {
        ...curriculum,
        goals: [...curriculum.goals, { id: goal.id, name: goal.name }],
      },
    };
  }, {});

  return Object.keys(curriculumsObject).map(key => curriculumsObject[key]);
}

const CompetenceGoals = ({ article }) => {
  if (!article.oldNdlaUrl) {
    return null;
  }

  const nodeId = article.oldNdlaUrl.split('/').pop();
  return (
    <Query
      asyncMode
      query={competenceGoalsQuery}
      variables={{ nodeId }}
      ssr={false}>
      {({ error, data, loading }) => {
        if (error) {
          handleError(error);
          return null;
        }

        if (loading) {
          return null;
        }

        const curriculums = groupByCurriculums(data.competenceGoals);
        return curriculums.map(curriculum => (
          <Fragment key={curriculum.id}>
            <CompetenceGoalListHeading>
              {curriculum.name}:
            </CompetenceGoalListHeading>
            <CompetenceGoalList goals={curriculum.goals} />
          </Fragment>
        ));
      }}
    </Query>
  );
};

CompetenceGoals.propTypes = {
  article: ArticleShape,
};

export default CompetenceGoals;
