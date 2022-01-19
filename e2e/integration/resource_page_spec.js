/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { visitOptions } from '../support';

describe('Resource page', () => {
  beforeEach(() => {
    cy.apiIntercept('POST', '**/graphql', 'resourcePageGraphQL');
  });

  it('contains content', () => {
    cy.visit(
      '/subject:1:94dfe81f-9e11-45fc-ab5a-fba63784d48e/topic:2:117982/resource:1:117868?disableSSR=true',
      visitOptions,
    );
    cy.apiwait('@resourcePageGraphQL');
    cy.get('.o-content').within(() => {
      cy.get('.c-breadcrumb__list > li').should($list => {
        expect($list).to.have.length(4);
      });
      cy.get('h1').contains('Muntlig eksamen MIK 1');
      cy.get('button').contains('Regler for bruk');
    });
  });
});
