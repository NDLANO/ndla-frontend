/// <reference types="cypress"/>
/* eslint-disable @typescript-eslint/no-namespace */
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

import { Interception } from 'cypress/types/net-stubbing';
import { isEqual } from 'lodash';

// alias can be a a string for single requests or an array of strings for multiple requests
// Multiple requests also needs an array of GraphQL operation names to distinguish different requests

interface InterceptOptions {
  method?: 'POST';
  url?: string;
  alias: string;
  operations: string[];
}

declare global {
  namespace Cypress {
    interface ResolvedConfigOptions {
      projectRoot: string;
    }
    interface Chainable {
      gqlIntercept(options: InterceptOptions): Chainable;
      gqlWait(alias: string): Chainable<Interception>;
      fixCypressSpec(filename: string): void;
    }
  }
}
// https://github.com/meinaart/cypress-plugin-snapshots/issues/10
// This is required in order to fix a bug that occurs when calling Cypress.spec when running all specs.
Cypress.Commands.add('fixCypressSpec', filename => {
  const path = require('path');
  const relative = filename.substr(1); // removes leading "/"
  const projectRoot = Cypress.config('projectRoot');
  const absolute = path.join(projectRoot, relative);
  Cypress.spec = {
    absolute,
    name: path.basename(filename),
    relative,
  };
});

type MethodType = 'POST';
Cypress.Commands.add(
  'apiIntercept',
  (
    method: MethodType,
    url: string,
    alias: string,
    operationNames: string[] = [],
  ) => {
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

Cypress.Commands.add(
  'gqlIntercept',
  ({
    method = 'POST',
    url = '**/graphql',
    alias,
    operations,
  }: InterceptOptions) => {
    cy.intercept(method, url, req => {
      const bodyOperationNames = Array.isArray(req.body)
        ? req.body.map(b => b.operationName)
        : [req.body.operationName];
      const operationsMatch = isEqual(
        bodyOperationNames.sort(),
        [...operations].sort(),
      );
      if (!operationsMatch) {
        return;
      }
      req.alias = alias;
      if (operationsMatch && Cypress.env('USE_FIXTURES')) {
        const fixturePrefix = Cypress.spec.name.split('.')[0];
        req.reply({
          fixture: `${fixturePrefix}_${req.alias}`,
        });
      }
    });
  },
);

const readResponseBody = (body: any): Promise<string | ArrayBuffer> => {
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

Cypress.Commands.add('gqlWait', (aliases: string[]) => {
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
          jsons.map((json, i) => {
            const prefix = Cypress.spec.name.split('.')[0];
            const alias = Array.isArray(aliases) ? aliases[i] : aliases;
            return {
              xhr: originalXhr,
              name: `${prefix}_${alias.replace('@', '')}`,
              json: json,
            };
          }),
        ),
      )
      .then(() => originalXhr);
  }

  return cy.wait(aliases);
});

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
