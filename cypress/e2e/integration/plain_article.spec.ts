/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Plain article page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/plain_article.spec.ts');
    cy.gqlIntercept({
      alias: 'plainArticle',
      operations: ['plainArticlePage', 'alerts', 'mastHead'],
    });
  });

  it('contains content', () => {
    cy.visit('/article/1/?disableSSR=true');
    cy.gqlWait('@plainArticle');
    cy.get('[id="SkipToContentId"]').within(() => {
      cy.get('h1').contains('Utforskeren');
    });
  });
});
