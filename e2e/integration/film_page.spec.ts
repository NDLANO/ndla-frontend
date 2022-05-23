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
      operations: ['filmFrontPage', 'alerts'],
    });
    cy.gqlIntercept({
      alias: 'mastHead',
      operations: ['mastHead'],
    });
  });

  it('has content', () => {
    cy.visit('/subject:20?disableSSR=true');
    cy.gqlWait('@filmPage');
    cy.gqlWait('@mastHead');
    cy.get('.c-film-slideshow').within(() => {
      cy.get('h1').contains('Systemsprengeren');
    });
    cy.get('.c-film-moviesearch__topic-navigation').within(() => {
      cy.get('h2').contains('Emner i film');
      cy.get('nav > ul > li').should($list => {
        expect($list).to.have.length(7);
      });
    });
    cy.get('.c-film-movielist').should($list => {
      expect($list).to.have.length(5);
    });
  });
});
