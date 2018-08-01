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

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get('a:contains("Medieuttrykk")')
      .first()
      .click();
    cy.apiwait('@subjectpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'topicpageGraphQL');
    cy.get('[data-testid="topic-list"] li a:contains("Idéskaping")').click();
    cy.apiwait(['@topicpageGraphQL']);
  });

  it('contains article', () => {
    cy.get('article > section:first-child').within(() => {
      cy.get('h1').contains(/\w+/);
    });
  });
});
