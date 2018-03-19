describe('Topic page', () => {
  beforeEach(() => {
    cy.server();
    const visitOptions = {
      onBeforeLoad: win => {
        win.fetch = null;
      },
    };
    cy.visit('/', visitOptions);
  });
  it('contains everything', () => {
    cy.get('[data-cy=subject-list] li:first-child a').click();
    cy.get('[data-cy="topic-list"] li:first-child a').click();
    cy.get('article > section:first-child').within(() => {
      cy.get('h1').contains(/\w+/);
      cy
        .get('button')
        .first()
        .click();
      cy.get('div[role="dialog"]').should('have.attr', 'aria-hidden', 'false');
    });
  });
  it('send the needed server calls', () => {
    cy.route('**/article-converter/**').as('articleApi');
    cy.route('**/taxonomy/v1/topics/**').as('resourceCall');
    cy
      .route('**/taxonomy/v1/resource-types/?language=nb')
      .as('resourceTypesCall');
    cy.get('[data-cy=subject-list] li:first-child a').click();
    cy.get('[data-cy="topic-list"] li:first-child a').click();
    cy
      .wait(['@articleApi', '@resourceCall', '@resourceTypesCall'])
      .spread((article, resource, resourceTypes) => {
        expect(article.response.body).to.be.an('object');
        expect(resource.response.body).to.be.an('array');
        expect(resourceTypes.response.body).to.be.an('array');
      });
  });
});
