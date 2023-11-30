/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Film page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/film_page.spec.ts');
    cy.gqlIntercept({
      alias: 'filmPage',
      operations: [
        'myNdlaData',
        'filmFrontPage',
        'alerts',
        'mastHead',
        'mastheadFrontpage',
        'mastheadProgramme',
      ],
    });
  });

  it('has content', () => {
    cy.visit('/subject:20?disableSSR=true');
    cy.gqlWait('@filmPage');
    cy.contains('a', 'Alle utlendinger').should('be.visible');
    cy.contains('h2', 'Emner i film')
      .parent()
      .within(() => {
        cy.get('nav > ul > li').should(($list) => {
          expect($list).to.have.length(7);
        });
      });
    cy.contains('h2', 'Identitet')
      .parent()
      .parent()
      .children()
      .should(($list) => {
        expect($list).to.have.length(5);
      });
  });
});
