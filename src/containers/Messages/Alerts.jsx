/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { timeoutMessage, clearMessage } from './messagesActions';
import { MessageShape } from '../../shapes';

export const Action = ({ title, onClick }) => (
  <button onClick={onClick} className="un-button alert_action">
    <span className="alert_action-text">{title}</span>
  </button>
);

Action.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const Alert = ({ message, dispatch }) => {
  const onClick = () => {
    message.action.onClick();
    dispatch(clearMessage(message.id));
  };

  const severity = message.severity ? message.severity : 'info';

  return (
    <div className={`alert alert--${severity}`}>
      <div className="alert_msg">
        {message.message}
      </div>
      <button
        className="alert_dismiss un-button"
        onClick={() => dispatch(clearMessage(message.id))}>
        X
      </button>
      {message.action
        ? <Action title={message.action.title} onClick={onClick} />
        : null}
    </div>
  );
};

Alert.propTypes = {
  message: MessageShape.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const Alerts = ({ dispatch, messages }) => {
  const isHidden = messages.length === 0;
  const overlayClasses = classNames({
    'alert-overlay': true,
    'alert-overlay--hidden': isHidden,
  });

  messages
    .filter(m => m.timeToLive > 0)
    .forEach(item => dispatch(timeoutMessage(item)));

  return (
    <div className={overlayClasses}>
      {messages.map(message => (
        <Alert key={message.id} dispatch={dispatch} message={message} />
      ))}
    </div>
  );
};

Alerts.propTypes = {
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Alerts;
