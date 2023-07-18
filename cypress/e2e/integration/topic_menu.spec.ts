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
      operations: ['examLockStatus', 'alerts', 'frontpageData'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
    cy.gqlIntercept({
      alias: 'subjectpageTopicMenu',
      operations: ['mastHead', 'subjectPageTest'],
    });
  });

  it('Menu is displayed', () => {
    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('a:contains("Markedsføring og ledelse 1")')
      .last()
      .click();
    cy.gqlWait('@subjectpageTopicMenu');

    cy.get('[data-testid=masthead-menu-button]').click();

    cy.get('a').contains('Markedsføring og ledelse 1');
  });
});
