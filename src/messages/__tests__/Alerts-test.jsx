/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import uuid from 'node-uuid';

import { Alerts, Alert, Action } from '../Alerts';
import { clearMessage } from '../../messages/messagesActions';

const noop = () => {};

test('component/Alerts one message', t => {
  let alertMessages = [{ id: uuid.v4(), message: 'Testmessage' }];
  const component = shallow(<Alerts messages={alertMessages} dispatch={noop} />);
  const alertElement = component.find('Alert');

  t.equals(alertElement.length, 1);

  t.end();
});

test('component/Alerts two messages', t => {
  const messages = ['Testmessage', 'TEST'];
  let alertMessages = [{ id: uuid.v4(), message: messages[0], severity: 'success' }, { id: uuid.v4(), message: messages[1] }];
  const component = shallow(<Alerts messages={alertMessages} dispatch={noop} />);

  const alertElement = component.find('Alert');
  t.equals(alertElement.length, 2);

  // const alertDIc = component.find('.alert');
  // t.equal(alertDIc.prop('className'), 'alert alert--success');

  t.end();
});


test('component/Alerts without messages', t => {
  const component = shallow(<Alerts messages={[]} dispatch={noop} />);
  t.ok(component.hasClass('alert-overlay--hidden'));
  t.end();
});


test('component/Alert dismiss', t => {
  const dispatch = sinon.spy(() => {});
  const id = uuid.v4();

  const dismissBt = shallow(
    <Alert message={{ id, message: 'whatever', severity: 'info' }} dispatch={dispatch} />
  ).find('.alert_dismiss');

  dismissBt.simulate('click');

  t.ok(dispatch.calledOnce);
  t.deepEquals(dispatch.firstCall.args, [clearMessage(id)]);

  t.end();
});

test('component/Action click', t => {
  const handleClick = sinon.spy(() => {});

  const actionBtn = shallow(
    <Action title="Undo" onClick={handleClick} />
  );

  actionBtn.simulate('click');

  t.ok(handleClick.calledOnce);

  t.end();
});
