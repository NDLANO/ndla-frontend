/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// cypress/plugins/index.ts
/// <reference types="cypress" />

const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

interface Fixture {
  name: string;
  json: string;
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('task', {
    writeFixtures: (fixtures: Fixture[]) =>
      fixtures.map((fixture) => {
        const fileName = path.join(fixturesDir, `${fixture.name}.json`);
        fs.writeFileSync(fileName, fixture.json, 'utf-8');
        return fixture.json;
      }),
  });
};
