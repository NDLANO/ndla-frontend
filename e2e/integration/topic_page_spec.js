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
    cy.visit('/', visitOptions);
  });

  it('contains everything', () => {
    cy.get('[data-cy=subject-list] li:first-child a').click();
    cy.get('[data-cy="topic-list"] li:first-child a').click();
    cy.get('article > section:first-child').within(() => {
      cy.get('h1').contains(/\w+/);
      cy
        .get('button')
        .first()
        .click();
      cy.get('div[role="dialog"]').should('have.attr', 'aria-hidden', 'false');
    });
  });

  it('send the needed server calls', () => {
    cy.myroute({
      url: '**/article-converter/**',
      uuid: 'topicPageArticleConverter',
    });
    cy.myroute({
      method: 'POST',
      url: '**/graphql',
      uuid: 'topicPageGraphql',
    });

    cy.get('[data-cy="subject-list"] li:first-child a').click();
    cy.get('[data-cy="topic-list"] li:first-child a').click();

    cy
      .mywait(['@topicPageArticleConverter', '@topicPageGraphql'])
      .spread((article, graphql) => {
        console.log(article);
        console.log(graphql);
      });
  });
});
