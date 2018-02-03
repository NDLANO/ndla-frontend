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
import PlainArticlePage from './containers/PlainArticlePage/PlainArticlePage';
import SearchPage from './containers/SearchPage/SearchPage';
import SubjectsPage from './containers/SubjectsPage/SubjectsPage';
import SubjectPage from './containers/SubjectPage/SubjectPage';
import TopicPage from './containers/TopicPage/TopicPage';
import NotFoundPage from './containers/NotFoundPage/NotFoundPage';
import config from './config';

const searchEnabled =
  __SERVER__ || process.env.NODE_ENV === 'unittest'
    ? config.searchEnabled
    : window.DATA.config.searchEnabled;

class ScrollToTop extends React.Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

const Route = ({
  component: Component,
  initialProps,
  locale,
  background,
  ...rest
}) => (
  <ReactRoute
    {...rest}
    render={props => (
      <App background={background}>
        <ScrollToTop />
        <Content>
          <Masthead {...props} />
          <Component
            {...props}
            locale={locale}
            initialProps={initialProps}
            searchEnabled={searchEnabled}
          />
        </Content>
      </App>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func.isRequired,
  background: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const SearchRoute = searchEnabled
  ? { path: '/search', component: SearchPage, background: false }
  : undefined;

export const articlePath =
  '/article/:subjectId/(.*)/:topicId/urn\\:resource\\::plainResourceId/:articleId';

export const routes = [
  {
    path: '/',
    exact: true,
    component: WelcomePage,
    background: false,
  },
  {
    path: articlePath,
    component: ArticlePage,
    background: true,
  },
  {
    path: '/article/:articleId',
    component: PlainArticlePage,
    background: true,
  },
  SearchRoute,
  {
    path: '/subjects/:subjectId/(.*)/:topicId',
    component: TopicPage,
    background: true,
  },
  {
    path: '/subjects/:subjectId/:topicId',
    component: TopicPage,
    background: true,
  },
  {
    path: '/subjects/:subjectId/',
    component: SubjectPage,
    background: true,
  },
  {
    path: '/subjects',
    component: SubjectsPage,
    background: false,
  },
  {
    component: NotFoundPage,
    background: false,
  },
];

export default function(initialProps, locale) {
  return (
    <Switch>
      {routes
        .filter(route => route !== undefined)
        .map(route => (
          <Route
            key={uuid()}
            exact={route.exact}
            initialProps={initialProps}
            locale={locale}
            component={route.component}
            background={route.background}
            path={route.path}
          />
        ))}
    </Switch>
  );
}
