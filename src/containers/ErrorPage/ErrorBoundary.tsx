/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Component, ReactNode } from "react";
import { DefaultErrorMessage, DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { handleError } from "../../util/handleError";

interface State {
  hasError: boolean;
}

interface Props {
  children?: ReactNode;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <DefaultErrorMessage />;
    }

    return this.props.children;
  }
}

export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <DefaultErrorMessagePage />;
    }

    return this.props.children;
  }
}
