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
    cy.apiroute('POST', '**/graphql', 'frontpageGraphQL');
    cy.visit('/?disableSSR=true', visitOptions);
    cy.apiwait('@frontpageGraphQL');
    cy.apiroute('POST', '**/graphql', 'frontpageSearchGraphQL');
    cy.apiwait('@frontpageSearchGraphQL');

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get(
      '[data-testid="category-list"]  button:contains("Studiespesialisering"):visible',
    )
      .click()
      .get('a:contains("Medieuttrykk")')
      .last()
      .click({ force: true });
    cy.apiwait('@subjectpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'topicpageGraphQL');
    cy.get('[data-testid="topic-list"] li a:contains("Idéskaping")').click({
      force: true,
    });
    cy.apiwait(['@topicpageGraphQL']);
  });

  it('contains article', () => {
    cy.get('article > section:first-child').within(() => {
      cy.get('h1').contains(/\w+/);
    });
  });
});
