/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Iframe resource page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'iframeResourceGraphQL');
  });

  it('contains content', () => {
    cy.visit('/article-iframe/resource:1:124037/3?disableSSR=true', visitOptions);
    cy.apiwait('@iframeResourceGraphQL');
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Meninger og kunnskap om samfunnet');
    });
  });
});
