/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentClass, Component, SFC } from 'react';

type Props = {
  slackChannel: string;
};

type State = {
  error?: Error;
  errorInfo?: string;
  onError?: (error: Error, errorInfo: string) => null;
};

const ErrorBoundary: ComponentClass<
  Props,
  State
> = class ErrorBoundary extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      error: undefined,
      errorInfo: undefined,
      onError: props.onError,
    };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error(`ErrorBoundary, error: ${error}, info: ${errorInfo}`);
    this.setState({ error, errorInfo });

    // Exposed for testing
    if (this.state.onError) {
      this.state.onError(error, errorInfo);
    }
  }

  render() {
    const { slackChannel } = this.props;
    const { error, errorInfo } = this.state;

    if (!errorInfo) {
      return this.props.children;
    }

    return (
      <Error error={error} errorInfo={errorInfo} slackChannel={slackChannel} />
    );
  }
};

export default ErrorBoundary;

type EProps = {
  error?: Error;
  errorInfo?: string;
  slackChannel: string;
};

const Error: SFC<EProps> = ({ slackChannel }) => {
  return (
    <div>
      Something went wrong here. Please contact {slackChannel} for help.
    </div>
  );
};
