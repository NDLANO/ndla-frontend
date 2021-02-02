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

// alias can be a a string for single requests or an array of strings for multiple requests
// Multiple requests also needs an array of GraphQL operation names to distinguish different requests
Cypress.Commands.add(
  'apiIntercept',
  (method, url, alias, operationNames = []) => {
    cy.intercept(method, url, req => {
      const reqOperationName = req.body[0].operationName;
      if (!operationNames.length) {
        req.alias = alias;
      } else if (operationNames.includes(reqOperationName)) {
        req.alias = alias[operationNames.indexOf(reqOperationName)];
      }
      if (Cypress.env('USE_FIXTURES')) {
        req.reply({
          fixture: req.alias,
        });
      }
    });
  },
);

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
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    fr.readAsText(blob);
  });
};

Cypress.Commands.add('apiwait', aliases => {
  if (Cypress.env('RECORD_FIXTURES')) {
    let originalXhr = null;
    return cy
      .wait(aliases)
      .then(xhr => {
        originalXhr = xhr;
        if (Array.isArray(xhr)) {
          return xhr;
        }
        return [xhr];
      })
      .then(xhrs =>
        Promise.all(xhrs.map(xhr => readResponseBody(xhr.response.body))),
      )
      .then(jsons =>
        cy.task(
          'writeFixtures',
          jsons.map((json, i) => ({
            xhr: originalXhr,
            name: Array.isArray(aliases)
              ? aliases[i].replace('@', '')
              : aliases.replace('@', ''),
            json: json,
          })),
        ),
      )
      .then(() => originalXhr);
  }

  return cy.wait(aliases);
});
