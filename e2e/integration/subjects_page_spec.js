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
    cy.apiroute('POST', '**/graphql', 'frontpageGraphQL');
    cy.visit('/', visitOptions);
    cy.apiwait('@frontpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get('[data-cy="subject-list"] li a:contains("Medieuttrykk")').click();
    cy.apiwait('@subjectpageGraphQL');
  });

  it('should include a list of valid topic links', () => {
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
    cy
      .get('[data-cy="breadcrumb-section"] a')
      .should('have.length', 1)
      .and('have.attr', 'href');

    cy.get('input[type="checkbox"]').each(el => {
      expect(el.attr('id')).to.equal(el.siblings().attr('for'));
    });
  });
});
