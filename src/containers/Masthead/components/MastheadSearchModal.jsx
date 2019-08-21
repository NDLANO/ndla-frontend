/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal';
import Button from '@ndla/button';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { ToggleSearchButton } from '@ndla/ui';

import { Cross } from '@ndla/icons/action';

const searchFieldClasses = BEMHelper({
  prefix: 'c-',
  name: 'search-field',
});

const MastheadSearchModal = ({
  onSearchExit,
  children,
  hideOnNarrowScreen,
  inputRef,
  ndlaFilm,
  t,
}) => (
  <Modal
    backgroundColor="grey"
    animation="slide-down"
    animationDuration={200}
    size="full-width"
    onOpen={() => {
      inputRef.current.focus();
    }}
    onClose={onSearchExit}
    className="c-search-field__overlay-content"
    activateButton={
      <ToggleSearchButton
        ndlaFilm={ndlaFilm}
        hideOnNarrowScreen={hideOnNarrowScreen}>
        {t('masthead.menu.search')}
      </ToggleSearchButton>
    }>
    {onClose => (
      <Fragment>
        <div className="c-search-field__overlay-top" />
        <div {...searchFieldClasses('header')}>
          <div {...searchFieldClasses('header-container')}>
            {children}
            <Button stripped onClick={onClose}>
              <Cross className="c-icon--medium" />
            </Button>
          </div>
        </div>
      </Fragment>
    )}
  </Modal>
);

MastheadSearchModal.propTypes = {
  onSearchExit: PropTypes.func.isRequired,
  hideOnNarrowScreen: PropTypes.bool.isRequired,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  ndlaFilm: PropTypes.bool,
};

export default injectT(MastheadSearchModal);
