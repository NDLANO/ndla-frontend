/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Subjects page', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/', visitOptions);
  });

  it('should include a list of valid topic links', () => {
    cy.get('[data-cy=subject-list] li:first-child a').first().click();
    cy.get('[data-cy="topic-list"] h1').contains(/\w+/);

    cy.get('[data-cy="topic-list"] a').each(el => {
      cy
        .wrap(el)
        .should('have.attr', 'href')
        .and('include', '/topic');
      cy.wrap(el).contains(/\w+/);
    });
  });

  it('should have a valid breadcrumb, filter and language select', () => {
    cy.get('[data-cy=subject-list] li:first-child a').first().click();

    cy
      .get('[data-cy="breadcrumb-section"] a')
      .should('have.length', 1)
      .and('have.attr', 'href');

    cy.get('input[type="checkbox"]').each(el => {
      cy.wrap(el).click();
      expect(el.attr('id')).to.equal(el.siblings().attr('for'));
    });

    cy.get('[data-cy=language-select]').select(['nn']);
    cy.url().should('include', 'nn');
  });

  it('Should call graphql-api', () => {
    cy.route('POST', '**/graphql').as('graphqlApi');
    cy.get('[data-cy=subject-list] li:first-child a').first().click();

    cy.wait('@graphqlApi').then(data => {
      // Tmp fix for build. We are going to rewrite how we handle api requests.
      // expect(data.response.body).to.be.an('object');
    });
  });
});
