/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { getComponentName } from 'ndla-util';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { END } from 'redux-saga';
import { STORE_KEY } from '../configureStore';

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
    const { isServer } = ctx;
    const store = isServer ? ctx.store : window[STORE_KEY];
    let props = {};
    const actions = mapDispatchToProps
      ? bindActionCreators(mapDispatchToProps, store.dispatch)
      : {};

    if (BaseComponent.getInitialProps) {
      const baseProps = await BaseComponent.getInitialProps({
        ...ctx,
        ...actions,
      });
      props = { ...baseProps };
    }

    if (isServer) {
      store.dispatch(END);
      await store.sagaTask.done;
    }

    return props;
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(component);
};

export default connectSSR;
