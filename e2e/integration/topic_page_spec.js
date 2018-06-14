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
    cy.visit('/', visitOptions);
    cy.apiwait('@frontpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'subjectpageGraphQL');
    cy.get('[data-cy="subject-list"] li a:contains("Medieuttrykk")').click();
    cy.apiwait('@subjectpageGraphQL');

    cy.apiroute('POST', '**/graphql', 'topicpageGraphQL');
    cy.apiroute('GET', '**/article-converter/**', 'topicpageArticleConverter');
    cy.apiroute('GET', '/taxonomy/v1/subjects/*', 'topicpageTaxonomySubject');
    cy.apiroute(
      'GET',
      '/taxonomy/v1/subjects/*/topics/*',
      'topicpageTaxonomySubjectTopics',
    );
    cy.apiroute('GET', '/taxonomy/v1/topics/**', 'topicpageTaxonomyTopics');
    cy.apiroute('GET', '/article-api/v2/articles**', 'topicpageArticles');
    cy.get('[data-cy="topic-list"] li a:contains("Idéskaping")').click();
    cy.apiwait([
      '@topicpageGraphQL',
      '@topicpageArticleConverter',
      '@topicpageTaxonomySubject',
      '@topicpageTaxonomyTopics',
      '@topicpageArticles',
      '@topicpageTaxonomySubjectTopics',
    ]);
  });

  it('contains everything', () => {
    cy.get('article > section:first-child').within(() => {
      cy.get('h1').contains(/\w+/);
      cy
        .get('button')
        .first()
        .click();
      cy.get('div[role="dialog"]').should('have.attr', 'aria-hidden', 'false');
    });
  });
});
