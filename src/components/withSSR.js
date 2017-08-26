import React from 'react';
import { getComponentName } from 'ndla-util';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { END } from 'redux-saga';

function withSSR(BaseComponent) {
  const WrappedComponent = props => <BaseComponent {...props} />;

  WrappedComponent.displayName = `withSSR(${getComponentName(BaseComponent)})`;

  const component = hoistNonReactStatics(WrappedComponent, BaseComponent);

  component.getInitialProps = async function getInitialProps(ctx) {
    const { isServer, store } = ctx;
    let props = {};

    if (BaseComponent.getInitialProps) {
      props = await BaseComponent.getInitialProps(ctx);
    }

    if (isServer) {
      store.dispatch(END);
      await store.sagaTask.done;
      return { ...props, store };
    }
    return props;
  };

  return component;
}

export default withSSR;
