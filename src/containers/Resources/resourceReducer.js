/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as actions from './resourceActions';
import {
  getArticleIdFromResource,
  getLearningPathIdFromResource,
} from './resourceHelpers';

export const initalState = {
  all: {},
  types: [],
};

export default handleActions(
  {
    [actions.setTopicResources]: {
      next: (state, action) => {
        const { topicId, resources } = action.payload;
        return {
          ...state,
          all: { ...state.all, [topicId]: resources },
        };
      },
      throw: state => state,
    },
    [actions.setResourceTypes]: {
      next: (state, action) => {
        const resourceTypes = action.payload;
        return {
          ...state,
          types: resourceTypes,
        };
      },
      throw: state => state,
    },
    [actions.setArticleResourceData]: {
      next: (state, action) => {
        const { articleResourceData, topicId } = action.payload;

        const resources = state.all[topicId].map(resource => {
          const articleId = getArticleIdFromResource(resource);
          if (articleId) {
            const article = articleResourceData.find(a => a.id === articleId);
            if (article) {
              const { introduction, title } = article;
              return { ...resource, introduction, title };
            }
          }
          return resource;
        });

        return {
          ...state,
          all: { ...state.all, [topicId]: resources },
        };
      },
      throw: state => state,
    },
    [actions.setLearningPathResourceData]: {
      next: (state, action) => {
        const { learningPathResourceData, topicId } = action.payload;
        const resources = state.all[topicId].map(resource => {
          const learningPathId = getLearningPathIdFromResource(resource);
          if (learningPathId) {
            const learningPath = learningPathResourceData.find(
              lp => lp.id.toString() === learningPathId,
            );
            if (learningPath) {
              const { description, coverPhotoUrl, title } = learningPath;
              return { ...resource, description, coverPhotoUrl, title };
            }
          }
          return resource;
        });

        return {
          ...state,
          all: { ...state.all, [topicId]: resources },
        };
      },
      throw: state => state,
    },
  },
  initalState,
);
