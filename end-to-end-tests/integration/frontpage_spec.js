describe('Front page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('should have a list of valid links on front page', () => {
    cy.get('[data-cy=subject-list] a').each(el => {
      cy
        .wrap(el)
        .should('have.attr', 'href')
        .and('include', '/subjects/');
      cy.wrap(el).contains(/\w+/);
    });
  });
  it('should have a functioning change language box', () => {
    cy.get('[data-cy=language-select]').select(['nn']);
    cy.url().should('include', '/nn/');
  });
});
