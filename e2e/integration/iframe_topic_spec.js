/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Iframe topic page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'iframeTopicGraphQL');
  });

  it('contains content', () => {
    cy.visit(
      '/article-iframe/nb/urn:topic:2:170165/2?disableSSR=true',
      visitOptions,
    );
    cy.apiwait('@iframeTopicGraphQL');
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Samfunnsfaglige tenkemåter');
    });
  });
});
