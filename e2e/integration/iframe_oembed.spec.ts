/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Iframe oembed page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/iframe_oembed.spec.ts');
    cy.gqlIntercept({
      alias: 'iframeOembed',
      operations: ['iframeArticle'],
    });
  });

  it('contains content', () => {
    cy.visit('/article-iframe/nb/article/4?disableSSR=true');
    cy.gqlWait('@iframeOembed');
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Medier og informasjonskilder');
      cy.get('div').contains('Ressursen er hentet fra NDLA');
    });
  });
});
