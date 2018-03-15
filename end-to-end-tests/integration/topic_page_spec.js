describe('Topic page', () => {
  beforeEach(() => {
    cy.visit('/nb/subjects/subject:8/topic:1:182562');
  });
  it('contains everything', () => {
    cy.get('article');
    cy.get('section:first-child h1').contains(/\w+/);
  });
});
