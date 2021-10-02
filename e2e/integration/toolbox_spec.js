/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Toolbox page', () => {
  beforeEach(() => {
    cy.visit('/?disableSSR=true', visitOptions);
  });

  it('Toolbox for students shows OK', () => {
    cy.apiIntercept('POST', '**/graphql', 'toolboxStudentsGraphQL');
    cy.get('a:contains("Se alle tipsene for elever")').click({
      force: true,
    });
    cy.apiwait('@toolboxStudentsGraphQL');

    cy.get('[class="o-wrapper "] h1:contains("Verktøykassa – for elev")');

    cy.get('[data-testid="nav-box-item"] span').contains(/\w+/);

    cy.get('[data-testid="nav-box-list"] li a').each(el => {
      cy.wrap(el).should('have.attr', 'href');
      cy.wrap(el).contains(/\w+/);
    });
  });

  it('Toolbox for teachers shows OK', () => {
    cy.apiIntercept('POST', '**/graphql', 'toolboxTeachersGraphQL');
    cy.get('a:contains("Se alle tipsene for lærere")').click({
      force: true,
    });
    cy.apiwait('@toolboxTeachersGraphQL');

    cy.get('[class="o-wrapper "] h1:contains("Verktøykassa – for lærer")');

    cy.get('[data-testid="nav-box-item"] span').contains(/\w+/);

    cy.get('[data-testid="nav-box-list"] li a').each(el => {
      cy.wrap(el).should('have.attr', 'href');
      cy.wrap(el).contains(/\w+/);
    });
  });
});
