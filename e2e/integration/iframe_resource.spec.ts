/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const resourceId = 'urn:resource:1:124037';

describe('Iframe resource page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/iframe_resource.spec.ts');
    cy.gqlIntercept({
      alias: 'iframeResource',
      operations: ['iframePage'],
    });
    cy.gqlIntercept({
      alias: 'articleConcepts',
      operations: ['articleConcepts', 'competenceGoals'],
    });
  });

  it('contains content', () => {
    cy.visit(`/article-iframe/nb/${resourceId}/3?disableSSR=true`);
    cy.gqlWait('@iframeResource');
    cy.gqlWait('@articleConcepts');
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Meninger og kunnskap om samfunnet');
    });
  });
});
