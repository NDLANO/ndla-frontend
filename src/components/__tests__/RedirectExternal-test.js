/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

import { StaticRouter, MemoryRouter } from 'react-router';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import RedirectExternal from '../RedirectExternal';

test('External redirect for static router', () => {
  const context = {};
  renderer.create(
    <StaticRouter context={context}>
      <RedirectExternal to="https://google.com/" />
    </StaticRouter>,
  );

  expect(context).toEqual({
    action: 'REPLACE',
    location: 'https://google.com/',
    url: 'https://google.com/',
  });
});

test('External redirect for static router with basename', () => {
  const context = {};
  renderer.create(
    <StaticRouter basename="/nb" context={context}>
      <RedirectExternal to="https://google.com/" />
    </StaticRouter>,
  );

  expect(context).toEqual({
    action: 'REPLACE',
    location: 'https://google.com/',
    url: 'https://google.com/',
  });
});

test('External redirect for (memory/dom) router', () => {
  const context = {};
  const replace = sinon.spy();

  const oldWindow = window.location;
  delete window.location;
  window.location = {
    ...oldWindow,
    replace,
  };

  renderer.create(
    <MemoryRouter basename="/nb" context={context}>
      <RedirectExternal to="https://google.com/" />
    </MemoryRouter>,
  );

  expect(context).toEqual({});
  expect(replace.calledWith('https://google.com/')).toBe(true);
});
