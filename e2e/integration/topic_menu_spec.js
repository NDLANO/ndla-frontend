/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Topic menu', () => {
  beforeEach(() => {
    cy.server();
    cy.apiroute('POST', '**/graphql', 'frontpageGraphQL');
    cy.visit('/?disableSSR=true', visitOptions);
    cy.apiwait('@frontpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get('a:contains("Medieuttrykk")')
      .last()
      .click({ force: true });
    cy.apiwait('@subjectpageGraphQL');

    cy.get('[data-testid=masthead-menu-button]').click();
  });

  it('Menu is displayed', () => {
    cy.get('a').contains('Alle fag');
  });
});
