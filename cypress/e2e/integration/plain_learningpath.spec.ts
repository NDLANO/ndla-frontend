/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Plain learningpath page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/plain_learningpath.spec.ts');
    cy.gqlIntercept({
      alias: 'plainLearningpath',
      operations: ['myNdlaData', 'plainLearningpathPage', 'alerts', 'mastheadFrontpage', 'mastheadProgramme'],
    });
  });

  it('contains content', () => {
    cy.visit('/learningpaths/8/?disableSSR=true');
    cy.gqlWait('@plainLearningpath');
    cy.get('[data-testid="learningpath-content"]').within(() => {
      cy.get('h1').contains('Introduksjon');
    });
  });
});
