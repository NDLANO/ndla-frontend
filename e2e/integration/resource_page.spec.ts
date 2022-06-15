/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Resource page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/resource_page.spec.ts');
    cy.gqlIntercept({
      alias: 'resourcePage',
      operations: ['resourcePage', 'alerts', 'mastHead'],
    });
  });

  it('contains content', () => {
    cy.visit(
      '/subject:1:94dfe81f-9e11-45fc-ab5a-fba63784d48e/topic:2:117982/resource:1:117868?disableSSR=true',
    );
    cy.gqlWait('@resourcePage');
    cy.get('.o-content').within(() => {
      cy.get('[aria-label="Brødsmulesti"] > ol > li').should($list => {
        expect($list).to.have.length(4);
      });
      cy.get('h1').contains('Muntlig eksamen MIK 1');
      cy.get('button').contains('Regler for bruk');
    });
  });
});
