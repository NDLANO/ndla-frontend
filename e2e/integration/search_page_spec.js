/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Search page', () => {
  beforeEach(() => {
    cy.server();
  });

  it('contains search bar', () => {
    cy.visit('/search/?disableSSR=true', visitOptions);
    cy.get('input').focus();
  });

  it('LTI contains search bar', () => {
    cy.visit('/lti/?disableSSR=true', visitOptions);
    cy.get('input').focus();
  });
});
