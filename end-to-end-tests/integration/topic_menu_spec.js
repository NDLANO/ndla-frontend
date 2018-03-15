describe('Topic menu', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=subject-list] li:first-child a').click();
    cy
      .get('button')
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
