/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Toolbox page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/toolbox.spec.ts');
    cy.gqlIntercept({
      alias: 'alerts',
      operations: ['myNdlaData', 'alerts', 'frontpageData', 'mastheadProgramme', 'mastheadFrontpage'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
  });

  it('Toolbox for students shows OK', () => {
    cy.gqlIntercept({
      alias: 'toolboxStudents',
      operations: ['toolboxSubjectPage', 'mastHead'],
    });
    cy.get('button:contains("Meny")').click();
    cy.get('a:contains("Verktøykassa - for elever")').click();
    cy.get('h1:contains("Verktøykassa – for elever")');

    cy.get('[data-testid="nav-box-item"] span').contains(/\w+/);

    cy.get('[data-testid="nav-box-list"] li a').each((el) => {
      cy.wrap(el).should('have.attr', 'href');
      cy.wrap(el).contains(/\w+/);
    });
  });

  it('Toolbox for teachers shows OK', () => {
    cy.gqlIntercept({
      alias: 'toolboxTeachers',
      operations: ['toolboxSubjectPage', 'mastHead'],
    });
    cy.get('button:contains("Meny")').click();
    cy.get('a:contains("Verktøykassa - for lærere")').click();

    cy.get('h1:contains("Verktøykassa – for lærere")');

    cy.get('[data-testid="nav-box-item"] span').contains(/\w+/);

    cy.get('[data-testid="nav-box-list"] li a').each((el) => {
      cy.wrap(el).should('have.attr', 'href');
      cy.wrap(el).contains(/\w+/);
    });
  });
});
