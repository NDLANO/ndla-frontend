/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Topic page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/?disableSSR=true', visitOptions);

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Medieuttrykk 2")')
      .last()
      .click({ force: true });
    cy.apiwait('@subjectpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'topicpageGraphQL');
    cy.get('[data-testid="nav-box-list"] li a:contains("Idéskaping")').click({
      force: true,
    });
    cy.apiwait(['@topicpageGraphQL']);
  });

  it('contains article header and introduction', () => {
    cy.get('[data-testid="nav-topic-about"]').within(() => {
      cy.get('h1').contains(/\w+/);
      cy.get('div').contains(/\w+/);
    });
  });
});
