import React from 'react';
import { getComponentName } from 'ndla-util';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { connect } from 'react-redux';
import { END } from 'redux-saga';

export const connectSSR = (
  mapStateToProps,
  mapDispatchToProps,
) => BaseComponent => {
  const WrappedComponent = props => <BaseComponent {...props} />;

  WrappedComponent.displayName = `connectSSR(${getComponentName(
    BaseComponent,
  )})`;

  const component = hoistNonReactStatics(WrappedComponent, BaseComponent);

  component.mapDispatchToProps = mapDispatchToProps;
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

  return connect(mapStateToProps, mapDispatchToProps)(component);
};

export default connectSSR;
