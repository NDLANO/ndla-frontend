/*
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { CompetenceGoals } from '@ndla/ui';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Button from '@ndla/button';

import { Trans } from '@ndla/i18n';

const topics = [
  {
    heading: 'Emne',
    items: [
      {
        text:
          'Planlegge, produsere og presentere tekst, lyd, stillbilder, levende bilder og kombinasjoner av disse i aktuelle formater og standarder til trykte og elektroniske medier',
      },
      {
        text:
          'bruke relevante metoder for kvalitetssikring av egen arbeidsprosess og eget produkt',
      },
      {
        text:
          'bruke tidsmessig verktøy, programvare og annet teknisk utstyr på en forsvarlig måte',
      },
    ],
  },
];

export const CompetenceGoalsDialog = () => (
  <Trans>
    {({ t }) => (
      <Modal
        activateButton={
          <Button lighter>{t('competenceGoals.showCompetenceGoals')}</Button>
        }
        narrow>
        {onClose => (
          <Fragment>
            <ModalHeader>
              <ModalCloseButton
                onClick={onClose}
                title={t('competenceGoals.closeCompetenceGoals')}
              />
            </ModalHeader>
            <ModalBody>
              <CompetenceGoals
                // subjectName={menu ? subjectName : null}
                description="Læreplan i medieuttrykk - felles programfag i utdanningsprogram for medier og kommunikasjon"
                messages={{
                  heading: 'Kompetansemål og læreplan',
                  listDescription:
                    'Mål for opplæring er at elevene skal kunne:',
                }}
                topics={topics}
              />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
    )}
  </Trans>
);

CompetenceGoalsDialog.propTypes = {};

export default CompetenceGoalsDialog;
