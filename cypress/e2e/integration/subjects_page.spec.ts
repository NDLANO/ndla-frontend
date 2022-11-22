/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Subjects page', () => {
  beforeEach(() => {
    cy.gqlIntercept({
      alias: 'alerts',
      operations: ['alerts', 'subjects', 'mastHead'],
    });
    cy.fixCypressSpec('/e2e/integration/subjects_page.spec.ts');
    cy.visit('/?disableSSR=true');

    cy.gqlWait('@alerts');
  });

  it('should include a list of valid topic links', () => {
    cy.gqlIntercept({
      alias: 'subjectpage',
      operations: ['subjectPageTest', 'mastHead'],
    });

    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Medie- og informasjonskunnskap")')
      .last()
      .click({ force: true });
    cy.gqlWait('@subjectpage');

    cy.get('[data-testid="nav-box-item"] span').contains(/\w+/);

    cy.get('[data-testid="nav-box-list"] li a').each(el => {
      cy.wrap(el).should('have.attr', 'href');
      cy.wrap(el).contains(/\w+/);
    });
  });

  it('should have a valid breadcrumb', () => {
    cy.gqlIntercept({
      alias: 'subjectpage',
      operations: ['subjectPageTest', 'mastHead'],
    });

    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Medie- og informasjonskunnskap")')
      .last()
      .click({ force: true });
    cy.gqlWait('@subjectpage');

    cy.get('[data-testid="breadcrumb-list"] a')
      .should('have.length', 1)
      .and('have.attr', 'href');
  });
});
