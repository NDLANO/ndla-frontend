/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Iframe oembed page', () => {
  beforeEach(() => {
    cy.apiIntercept(
      'POST',
      '**/graphql',
      ['iframeOembedGraphQL', 'competenceGoalsGraphQL'],
      ['iframePage', 'competenceGoals'],
    );
  });

  it('contains content', () => {
    cy.visit('/article-iframe/nb/article/4?disableSSR=true', visitOptions);
    cy.apiwait(['@iframeOembedGraphQL', '@competenceGoalsGraphQL']);
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Medier og informasjonskilder');
      cy.get('div').contains('Ressursen er hentet fra NDLA');
    });
  });
});
