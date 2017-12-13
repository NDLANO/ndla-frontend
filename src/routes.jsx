/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactRoute from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { Content } from 'ndla-ui';
import { uuid } from 'ndla-util';

import WelcomePage from './containers/WelcomePage/WelcomePage';
import App from './containers/App/App';
import Masthead from './containers/Masthead';
import ArticlePage from './containers/ArticlePage/ArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import config from './config';

const searchEnabled =
  __SERVER__ || process.env.NODE_ENV === 'unittest'
    ? config.searchEnabled
    : window.config.searchEnabled;

class ScrollToTop extends React.Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

const Route = ({ component: Component, ...rest }) => (
  <ReactRoute
    {...rest}
    render={props => (
      <Content>
        <Masthead {...props} />
        <Component {...props} searchEnabled={searchEnabled} />
      </Content>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func.isRequired,
};

const SearchRoute = searchEnabled
  ? { path: '/search', component: SearchPage }
  : undefined;

export const routes = [
  {
    path: '/',
    exact: true,
    component: WelcomePage,
  },
  {
    path:
      '/article/:subjectId/(.*)/:topicId/urn\\:resource\\::plainResourceId/:articleId',
    component: ArticlePage,
  },
  {
    path: '/article/:articleId',
    component: ArticlePage,
  },
  SearchRoute,
  {
    path: '/subjects/:subjectId/(.*)/:topicId',
    component: TopicPage,
  },
  {
    path: '/subjects/:subjectId/:topicId',
    component: TopicPage,
  },
  {
    path: '/subjects/:subjectId/',
    component: SubjectPage,
  },
  {
    path: '/subjects',
    component: SubjectsPage,
  },
  {
    component: NotFoundPage,
  },
];

export default (
  <App>
    <ScrollToTop />
    <Switch>
      {routes
        .filter(route => route !== undefined)
        .map(route => (
          <Route
            key={uuid()}
            exact={route.exact}
            component={route.component}
            path={route.path}
          />
        ))}
    </Switch>
  </App>
);
