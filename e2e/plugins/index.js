/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const fs = require('fs');
const path = require('path');
// const chalk = require('chalk');
// const rimraf = require('rimraf');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

module.exports = (on, config) => {
  on('task', {
    writeFixtures: fixtures => {
      return fixtures.map(fixture => {
        const fileName = path.join(fixturesDir, `${fixture.name}.json`);
        fs.writeFileSync(fileName, fixture.json, 'utf-8');
        return fixture.json;
      });
    },
  });
};
