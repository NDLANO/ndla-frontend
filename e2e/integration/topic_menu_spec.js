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
    cy.visit('/?disableSSR=true', visitOptions);

    cy.apiIntercept('POST', '**/graphql', 'subjectpageTopicmenuGraphQL');
    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Markedsføring og ledelse 1")')
      .last()
      .click({ force: true });
    cy.apiwait('@subjectpageTopicmenuGraphQL');

    cy.get('[data-testid=masthead-menu-button]').click();
  });

  it('Menu is displayed', () => {
    cy.get('a').contains('Til forsiden');
  });
});
