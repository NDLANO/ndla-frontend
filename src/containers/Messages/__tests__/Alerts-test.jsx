/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import uuid from 'node-uuid';

import { Alerts, Alert, Action } from '../Alerts';
import { clearMessage } from '../messagesActions';

const noop = () => {};

test('component/Alerts one message', () => {
  const alertMessages = [{ id: uuid.v4(), message: 'Testmessage' }];
  const component = shallow(<Alerts messages={alertMessages} dispatch={noop} />);
  const alertElement = component.find(Alert);

  expect(alertElement.length).toBe(1);
});

test('component/Alerts two messages', () => {
  const messages = ['Testmessage', 'TEST'];
  const alertMessages = [{ id: uuid.v4(), message: messages[0], severity: 'success' }, { id: uuid.v4(), message: messages[1] }];
  const component = shallow(<Alerts messages={alertMessages} dispatch={noop} />);

  const alertElement = component.find(Alert);
  expect(alertElement.length).toBe(2);
});


test('component/Alerts without messages', () => {
  const component = shallow(<Alerts messages={[]} dispatch={noop} />);
  expect(component.hasClass('alert-overlay--hidden')).toBeTruthy();
});


test('component/Alert dismiss', () => {
  const dispatch = sinon.spy(() => {});
  const id = uuid.v4();

  const dismissBt = shallow(
    <Alert message={{ id, message: 'whatever', severity: 'info' }} dispatch={dispatch} />,
  ).find('.alert_dismiss');

  dismissBt.simulate('click');

  expect(dispatch.calledOnce).toBeTruthy();
  expect(dispatch.firstCall.args).toEqual([clearMessage(id)]);
});

test('component/Action click', () => {
  const handleClick = sinon.spy(() => {});

  const actionBtn = shallow(
    <Action title="Undo" onClick={handleClick} />,
  );

  actionBtn.simulate('click');

  expect(handleClick.calledOnce).toBeTruthy();
});
