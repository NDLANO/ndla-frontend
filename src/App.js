import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import ReactRoute from 'react-router-dom/Route';
import matchPath from 'react-router-dom/matchPath';
import withRouter from 'react-router-dom/withRouter';
import { Content } from 'ndla-ui';
import { uuid } from 'ndla-util';
import Page from './containers/Page/Page';
import Masthead from './containers/Masthead';
import { routes } from './routes';
import config from './config';
import handleError from './util/handleError';
import './style/index.css';

const searchEnabled =
  process.env.BUILD_TARGET === 'server' || process.env.NODE_ENV === 'unittest'
    ? config.searchEnabled
    : window.DATA.config.searchEnabled;

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
      <Page background={background}>
        <Content>
          <Masthead {...props} />
          <Component
            {...props}
            locale={locale}
            {...initialProps}
            searchEnabled={searchEnabled}
          />
        </Content>
      </Page>
    )}
  />
);

Route.propTypes = {
  component: PropTypes.func.isRequired,
  background: PropTypes.bool.isRequired,
  locale: PropTypes.string.isRequired,
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

async function loadInitialProps(pathname, ctx) {
  const promises = [];
  routes.some(route => {
    const match = matchPath(pathname, route);
    if (match && route.component.getInitialProps) {
      promises.push(route.component.getInitialProps({ match, ...ctx }));
    }
    return !!match;
  });
  return Promise.all(promises);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.initialProps };
    this.handleLoadInitialProps = this.handleLoadInitialProps.bind(this);
  }

  componentDidMount() {
    if (window.DATA.config.disableSSR) {
      this.handleLoadInitialProps(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const navigated = nextProps.location !== this.props.location;
    if (navigated) {
      window.scrollTo(0, 0);
      this.handleLoadInitialProps(nextProps);
    }
  }

  async handleLoadInitialProps(props) {
    try {
      const data = await loadInitialProps(props.location.pathname, {
        locale: props.locale,
        location: props.location,
        history: props.history,
      });
      this.setState({ data: data[0] });
    } catch (e) {
      handleError(e);
    }
  }

  render() {
    return (
      <Switch>
        {routes
          .filter(route => route !== undefined)
          .map(route => (
            <Route
              key={uuid()}
              exact={route.exact}
              initialProps={this.state.data}
              locale={this.props.locale}
              component={route.component}
              background={route.background}
              path={route.path}
            />
          ))}
      </Switch>
    );
  }
}

App.propTypes = {
  locale: PropTypes.string.isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }),
  initialProps: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
