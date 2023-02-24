/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Search page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/search_page.spec.ts');
    cy.gqlIntercept({
      alias: 'searchPage',
      operations: ['searchPage', 'alerts'],
    });
    cy.gqlIntercept({ alias: 'groupSearch', operations: ['GroupSearch'] });
  });

  it('contains search bar', () => {
    cy.visit('/search/?disableSSR=true');
    cy.gqlWait('@searchPage');
    cy.gqlWait('@groupSearch');
    cy.get('input').focus();
  });

  it('LTI contains search bar', () => {
    cy.visit('/lti/?disableSSR=true');
    cy.gqlIntercept({ alias: 'ltiSearch', operations: ['searchPage'] });
    cy.gqlWait('@ltiSearch');
    cy.gqlWait('@groupSearch');
    cy.get('input').focus();
  });

  it('LTI has insert button', () => {
    cy.visit('/lti/?disableSSR=true');
    cy.gqlIntercept({ alias: 'ltiSearch', operations: ['searchPage'] });
    cy.gqlWait('@ltiSearch');
    cy.gqlWait('@groupSearch');
    cy.get('section').first().within(() => {
      cy.get('button').contains('Sett inn');
    });
  });

});
