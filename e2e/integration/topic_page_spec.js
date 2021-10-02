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
    cy.visit('/?disableSSR=true', visitOptions);

    cy.apiIntercept('POST', '**/graphql', 'medieutrykkGraphQL');
    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Medieuttrykk 3 og mediesamfunnet 3")')
      .last()
      .click({ force: true });
    cy.apiwait('@medieutrykkGraphQL');
  });

  it('contains article header and introduction', () => {
    cy.apiIntercept('POST', '**/graphql', 'topicpageGraphQL');
    cy.get(
      '[data-testid="nav-box-list"] li a:contains("Idéskaping og mediedesign")',
    ).click({
      force: true,
    });
    cy.apiwait(['@topicpageGraphQL']);
    cy.get('[data-testid="nav-topic-about"]').within(() => {
      cy.get('h1').contains(/\w+/);
      cy.get('div').contains(/\w+/);
      cy.get('button').not();
    });
  });

  it('contains article header, introduction and content', () => {
    cy.apiIntercept('POST', '**/graphql', 'topicpageWithContentGraphQL');
    cy.get(
      '[data-testid="nav-box-list"] li a:contains("Tverrfaglige medieoppdrag")',
    ).click({
      force: true,
    });
    cy.apiwait(['@topicpageWithContentGraphQL']);
    cy.get('[data-testid="nav-topic-about"]').within(() => {
      cy.get('h1').contains(/\w+/);
      cy.get('div').contains(/\w+/);
      cy.get('button').contains('Vis hele emnebeskrivelsen');
    });
  });
});
