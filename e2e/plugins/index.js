/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const fs = require('fs');
const path = require('path');

const fixturesDir = path.join(__dirname, '..', 'fixtures');

module.exports = on => {
  on('task', {
    writeFixtures: fixtures =>
      fixtures.map(fixture => {
        const fileName = path.join(fixturesDir, `${fixture.name}.json`);
        fs.writeFileSync(fileName, fixture.json, 'utf-8');
        return fixture.json;
      }),
  });
};
