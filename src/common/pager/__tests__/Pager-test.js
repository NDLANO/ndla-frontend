/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import Pager, { PageLink } from '../Pager';


function pagerTest({ setup, expected }) {
  test(`component/LinkPager page ${setup.page}/${setup.lastPage}`, t => {
    const steps = shallow(<Pager pathname="somepath" query={{}} {...setup} />)
      .children();

    const prev = setup.page - 1;
    const next = setup.page + 1;

    t.is(steps.length, expected.length, 'steppers length');

    expected.forEach((value, i) => {
      const n = i + 1;
      const step = steps.at(i);

      switch (value) {
        case 'current':
          t.truthy(step.is('.search-stepper_step--active'), 'Current page active');
          t.is(step.text(), setup.page.toString(), 'Current page text');
          t.not(step.is(PageLink), 'Current page not linked');
          break;
        case 'back':
          t.truthy(step.is(PageLink), 'back is link');
          t.is(step.props().modifier, value, `Back link has ${value} modifier`);
          t.is(step.props().page, prev, `Back link links to page ${prev}`);
          break;
        case 'forward':
          t.truthy(step.is(PageLink), 'forward is link');
          t.is(step.props().modifier, value, `Forward link has ${value} modifier`);
          t.is(step.props().page, next, `Forward link links to page ${next}`);
          break;
        default:
          t.truthy(step.is(PageLink), `stepper ${n} is Link`);
          t.is(step.props().page, value, `Stepper ${n} links to page ${value}`);
          t.is(step.props().children, value, `Stepper ${n} has text ${value}`);
      }
    });
  });
}

pagerTest({
  setup: { page: 1, lastPage: 1 },
  expected: ['current'],
});

pagerTest({
  setup: { page: 3, lastPage: 5 },
  expected: ['back', 1, 2, 'current', 4, 5, 'forward'],
});

pagerTest({
  setup: { page: 1, lastPage: 5 },
  expected: ['current', 2, 3, 4, 5, 'forward'],
});

pagerTest({
  setup: { page: 19, lastPage: 19 },
  expected: ['back', 15, 16, 17, 18, 'current'],
});

pagerTest({
  setup: { page: 4, lastPage: 10 },
  expected: ['back', 2, 3, 'current', 5, 6, 'forward'],
});
