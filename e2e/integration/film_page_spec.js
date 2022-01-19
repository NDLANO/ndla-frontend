/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Film page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'filmPageGraphQL');
  });

  it('has content', () => {
    cy.visit('/subject:20?disableSSR=true', visitOptions);
    cy.apiwait('@filmPageGraphQL');
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
