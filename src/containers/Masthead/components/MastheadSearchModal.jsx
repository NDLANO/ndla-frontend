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

import { Search } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';

const classes = BEMHelper({
  prefix: 'c-',
  name: 'toggle-search-button',
  outputIsString: true,
});

const searchFieldClasses = BEMHelper({
  prefix: 'c-',
  name: 'search-field',
});

const MastheadSearchModal = ({ onSearchExit, children, searchFieldRef, t }) => (
  <Modal
    backgroundColor="grey"
    animation="slide-down"
    animationDuration={200}
    size="full-width"
    onOpen={() => {
      searchFieldRef.current.getElementsByTagName('input')[0].focus();
    }}
    onClose={onSearchExit}
    className="c-search-field__overlay-content"
    activateButton={
      <button
        type="button"
        className="c-button c-toggle-search-button__button c-toggle-search-button__button--wide">
        <span className={classes('button-text')}>
          {t('masthead.menu.search')}
        </span>
        <Search />
      </button>
    }>
    {onClose => (
      <Fragment>
        <div className="c-search-field__overlay-top" />
        <div ref={searchFieldRef} {...searchFieldClasses('header')}>
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
  searchFieldRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

export default injectT(MastheadSearchModal);
