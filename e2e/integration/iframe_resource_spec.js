/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

const resourceId = 'urn:resource:1:124037';

describe('Iframe resource page', () => {
  beforeEach(() => {
    cy.apiIntercept(
      'POST',
      '**/graphql',
      ['iframeResourceGraphQL', 'competenceGoalsGraphQL'],
      ['iframePage', 'competenceGoals'],
    );
  });

  it('contains content', () => {
    cy.visit(
      `/article-iframe/nb/${resourceId}/3?disableSSR=true`,
      visitOptions,
    );
    cy.apiwait(['@iframeResourceGraphQL', '@competenceGoalsGraphQL']);
    cy.get('.c-article').within(() => {
      cy.get('h1').contains('Meninger og kunnskap om samfunnet');
    });
  });
});
