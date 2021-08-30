/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Plain article page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'plainArticleGraphQL');
  });

  it('contains content', () => {
    cy.visit('/article/1/?disableSSR=true', visitOptions);
    cy.apiwait('@plainArticleGraphQL');
    cy.get('[id="SkipToContentId"]').within(() => {
      cy.get('h1').contains('Utforskeren');
    });
  });
});
