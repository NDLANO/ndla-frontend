/*
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CompetenceGoalsList } from '@ndla/ui';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import Button from '@ndla/button';

import { Trans } from '@ndla/i18n';

export const CompetenceGoalsDialog = ({ curriculums }) => (
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
              <div className="c-competence-goals">
                <h1>Kompetansemål og læreplan</h1>
                <hr />
                {curriculums.map(curriculum => (
                  <Fragment key={curriculum.id}>
                    <p>{curriculum.name}:</p>
                    <CompetenceGoalsList goals={curriculum.goals} />
                  </Fragment>
                ))}
              </div>
            </ModalBody>
          </Fragment>
        )}
      </Modal>
    )}
  </Trans>
);

CompetenceGoalsDialog.propTypes = {
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      goals: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
};

export default CompetenceGoalsDialog;
