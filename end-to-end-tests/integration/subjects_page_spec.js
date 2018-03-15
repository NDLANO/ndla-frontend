describe('Subjects page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy=subject-list] li:first-child a').click();
  });
  it('should include a list of valid topic links', () => {
    cy.get('[data-cy="topic-list"] h1').contains(/\w+/);
    cy.get('[data-cy="topic-list"] a').each(el => {
      cy
        .wrap(el)
        .should('have.attr', 'href')
        .and('include', '/topic');
      cy.wrap(el).contains(/\w+/);
    });
  });
  it('should have a valid breadcrumb, filter and language select', () => {
    cy
      .get('[data-cy="breadcrumb-section"] a')
      .should('have.length', 1)
      .and('have.attr', 'href');

    cy.get('input[type="checkbox"]').each(el => {
      cy.wrap(el).click();
      expect(el.attr('id')).to.equal(el.siblings().attr('for'));
    });
    cy.get('[data-cy=language-select]').select(['nn']);
    cy.url().should('include', 'nn');
  });
});
