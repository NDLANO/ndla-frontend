describe('Subjects page', () => {
  beforeEach(() => {
    cy.server();
    const visitOptions = {
      onBeforeLoad: win => {
        win.fetch = null;
      },
    };
    cy.visit('/', visitOptions);
  });
  it('should include a list of valid topic links', () => {
    cy.get('[data-cy=subject-list] li:first-child a').click();
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
    cy.get('[data-cy=subject-list] li:first-child a').click();
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
  it('Should call filter, taxonomi and article-api', () => {
    cy.route('**/taxonomy/v1/subjects/**/filters').as('filterCall');
    cy
      .route('**/taxonomy/v1/subjects/**/topics/?recursive=true&language=nb')
      .as('topicCall');
    cy.route('**/article-api/v2/articles**').as('resourceCall');
    cy.get('[data-cy=subject-list] li:first-child a').click();
    cy
      .wait(['@filterCall', '@topicCall', '@resourceCall'])
      .spread((filter, topic, resource) => {
        expect(topic.response.body).to.be.an('array');
        expect(topic.response.body).to.be.an('array');
        expect(resource.response.body).to.be.an('object');
      });
  });
});
