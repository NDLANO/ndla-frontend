/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Topic menu', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/e2e/integration/topic_menu.spec.ts');
    cy.gqlIntercept({
      alias: 'alerts',
      operations: ['examLockStatus', 'alerts', 'frontpageData', 'mastheadProgramme', 'mastheadFrontpage'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
    cy.gqlIntercept({
      alias: 'programme',
      operations: ['programmePage'],
    });
    cy.gqlIntercept({
      alias: 'subjectpageTopicMenu',
      operations: ['mastHead', 'subjectPageTest'],
    });
  });

  it('Menu is displayed', () => {
    cy.get('[data-testid="programme-list"]  a:contains("Medier og kommunikasjon"):visible')
      .click();
    cy.gqlWait('@programme');
    
    cy.get('a:contains("Medie- og informasjonskunnskap 2")')
      .last()
      .click();
    cy.gqlWait('@subjectpageTopicMenu');

    cy.get('[data-testid=masthead-menu-button]').click();

    cy.get('a').contains('Medie- og informasjonskunnskap 2');
  });
});
