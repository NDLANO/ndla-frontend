/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

describe('Topic menu', () => {
  beforeEach(() => {
    cy.visit('/');

    cy
      .get('[data-cy=subject-list] li:first-child a')
      .first()
      .click();
    cy
      .get('.c-topic-menu-container button')
      .contains('Meny')
      .click();
  });

  it('contains everything', () => {
    cy.get('a').contains('Fagoversikt');

    cy.get('.c-topic-menu__content input[type="checkbox"]').each(el => {
      cy.wrap(el).click();
      expect(el.attr('id')).to.equal(el.siblings().attr('for'));
    });

    cy.get('.c-topic-menu__content li > button').each(el => {
      cy.wrap(el).click();
    });
  });
});
