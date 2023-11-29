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
      operations: ['myNdlaData', 'alerts', 'frontpageData', 'mastheadProgramme', 'mastheadFrontpage'],
    });
    cy.visit('/?disableSSR=true');
    cy.gqlWait('@alerts');
  });

  it('contains article header and introduction', () => {
    cy.gqlIntercept({
      alias: 'subjects',
      operations: ['allSubjects'],
    });
    cy.gqlIntercept({
      alias: 'medieutrykk',
      operations: ['mastHead', 'subjectPageTest'],
    });

    cy.get('button:contains("Meny")').click();
    cy.get('div[role=dialog] nav a:contains("Fag")').click();
    cy.gqlWait('@subjects');

    cy.get('ul[aria-label="Filtrer fag"]  button:contains("ALLE FAG"):visible')
      .click();
    cy.get('a:contains("Medieuttrykk 3")')
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
      alias: 'subjects',
      operations: ['allSubjects'],
    });
    cy.gqlIntercept({
      alias: 'medieutrykk',
      operations: ['mastHead', 'subjectPageTest'],
    });

    cy.get('button:contains("Meny")').click();
    cy.get('div[role=dialog] nav a:contains("Fag")').click();
    cy.gqlWait('@subjects');

    cy.get('ul[aria-label="Filtrer fag"]  button:contains("ALLE FAG"):visible')
      .click();
    cy.get('a:contains("Medieuttrykk 3")')
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
