/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Plain learningpath page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'plainLearningpathGraphQL');
  });

  it('contains content', () => {
    cy.visit('/learningpaths/8/?disableSSR=true', visitOptions);
    cy.apiwait('@plainLearningpathGraphQL');
    cy.get('[data-testid="learningpath-content"]').within(() => {
      cy.get('h1').contains('Introduksjon');
    });
  });
});
