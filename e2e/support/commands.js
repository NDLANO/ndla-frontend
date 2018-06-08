// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('myroute', options => {
  if (Cypress.env('USE_FIXTURES')) {
    console.log('here');
    return cy
      .route(
        Object.assign({}, options, { response: `fixture:${options.uuid}` }),
      )
      .as(options.uuid);
  }
  return cy.route(options).as(options.uuid);
});

const readResponseBody = body => {
  const fr = new FileReader();

  return new Promise((resolve, reject) => {
    fr.onerror = () => {
      fr.abort();
      reject(new DOMException('Problem parsing body.'));
    };

    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsText(body);
  });
};

// function write
Cypress.Commands.add('mywait', aliases => {
  if (Cypress.env('WRITE_FIXTURES')) {
    return cy.wait(aliases).then(responses => {
      Promise.all(
        aliases.map((alias, i) => {
          return readResponseBody(responses[i].response.body).then(json => {
            return cy.task('writeFixture', {
              name: alias.replace('@', ''),
              json: json,
            });
          });
        }),
      );
      return responses;
    });
  }
  return cy.wait(aliases);
});
