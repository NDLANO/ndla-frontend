/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Multidiciplinary page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/multidisciplinary.spec.ts');
    cy.gqlIntercept({
      alias: 'alerts',
      operations: ['myNdlaData', 'alerts', 'frontpageData', 'mastheadProgramme', 'mastheadFrontpage'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
  });

  it('should show header', () => {
    cy.gqlIntercept({
      alias: 'multidisciplinary',
      operations: ['multidisciplinarySubjectPage', 'mastHead'],
    });
    cy.get('button:contains("Meny")').click();
    cy.get('a:contains("Tverrfaglige tema")').click();
    cy.gqlWait('@multidisciplinary');

    cy.get('h1:contains("Tverrfaglige temaer")');
  });
});
