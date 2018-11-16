/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { Query } from 'react-apollo';
import { competenceGoalsQuery } from '../../../queries';
import handleError from '../../../util/handleError';
import CompetenceGoalsDialog from '../../../components/CompetenceGoalsDialog';
import { ArticleShape } from '../../../shapes';

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

const ResourceCompetenceGoals = ({ article }) => {
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
        return <CompetenceGoalsDialog curriculums={curriculums} />;
      }}
    </Query>
  );
};

ResourceCompetenceGoals.propTypes = {
  article: ArticleShape,
};

export default ResourceCompetenceGoals;
