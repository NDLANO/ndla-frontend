/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { groupByCurriculums } from '../CompetenceGoals';

const competenceGoals = [
  {
    id: 'K15502',
    name:
      'gjøre rede for argumentasjonen i andres tekster og skrive egne argumenterende tekster på hovedmål og sidemål',
    curriculum: {
      id: 'NOR1-05',
      name: 'Læreplan i norsk',
    },
  },
  {
    id: 'K17637',
    name: 'bruke og vurdere virkemidler og fortellerteknikker i medieuttrykk',
    curriculum: {
      id: 'MOK2-01',
      name:
        'Læreplan i medieuttrykk - felles programfag i utdanningsprogram for medier og kommunikasjon',
    },
  },
  {
    id: 'K17635',
    name: 'lage budskap tilpasset målgruppe, formål og kanal',
    curriculum: {
      id: 'MOK2-01',
      name:
        'Læreplan i medieuttrykk - felles programfag i utdanningsprogram for medier og kommunikasjon',
    },
  },
];

test('That groupByCurriculums groups competenceGoals by curriculum ', () => {
  const grouped = groupByCurriculums(competenceGoals);
  expect(grouped).toMatchSnapshot();
});
