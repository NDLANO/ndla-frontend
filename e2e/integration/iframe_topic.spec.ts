/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Iframe topic page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/iframe_topic.spec.ts');
    cy.gqlIntercept({
      alias: 'iframeTopic',
      operations: ['iframePage'],
    });
  });

  it('contains content', () => {
    cy.visit('/article-iframe/nb/urn:topic:2:170165/2?disableSSR=true');
    cy.gqlWait('@iframeTopic');
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Samfunnsfaglige tenkemåter');
    });
  });
});
