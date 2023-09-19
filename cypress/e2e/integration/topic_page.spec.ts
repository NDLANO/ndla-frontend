/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Topic page', () => {
  beforeEach(() => {
    cy.fixCypressSpec('/cypress/integration/topic_page.spec.ts');
    cy.gqlIntercept({
      alias: 'alerts',
      operations: ['examLockStatus', 'alerts', 'frontpageSubjects'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
  });

  it('contains article header and introduction', () => {
    cy.gqlIntercept({
      alias: 'medieutrykk',
      operations: ['mastHead', 'subjectPageTest'],
    });

    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('button[id$="trigger-allsubjects"]')
      .click()
      .get('a:contains("Medieuttrykk 3 og mediesamfunnet 3")')
      .last()
      .click();
    cy.gqlWait('@medieutrykk');

    cy.gqlIntercept({
      alias: 'topicpage',
      operations: ['topicWrapper'],
    });
    cy.get(
      '[data-testid="nav-box-list"] li a:contains("Idéskaping og mediedesign")',
    ).click();
    cy.gqlWait('@topicpage');
    cy.get('[id="SkipToContentId"]').contains('Idéskaping og mediedesign');
  });

  it('contains article header, introduction and content', () => {
    cy.gqlIntercept({
      alias: 'medieutrykk',
      operations: ['mastHead', 'subjectPageTest'],
    });

    cy.get('[data-testid="category-list"]  button:contains("Alle fag"):visible')
      .click()
      .get('button[id$="trigger-allsubjects"]')
      .click()
      .get('a:contains("Medieuttrykk 3 og mediesamfunnet 3")')
      .last()
      .click();
    cy.gqlWait('@medieutrykk');

    cy.gqlIntercept({
      alias: 'topicpageWithContent',
      operations: ['topicWrapper'],
    });
    cy.get(
      '[data-testid="nav-box-list"] li a:contains("Tverrfaglige medieoppdrag")',
    ).click();
    cy.gqlWait('@topicpageWithContent');
    cy.get('[id="SkipToContentId"]').contains('Tverrfaglige medieoppdrag');
    cy.get('button').contains('Vis hele emnebeskrivelsen');
  });
});
