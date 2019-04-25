import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import { TopicMenuButton } from '@ndla/ui';
import { Context as StaticContext, Experiment, Variant } from '@ndla/abtest';

const MastheadMenuModal = ({ children, onMenuExit, t }) => (
  <Modal
    size="fullscreen"
    activateButton={
      <TopicMenuButton data-testid="masthead-menu-button">
        <StaticContext.Consumer>
          {(experiments) => (
            <Experiment id="PNJbRd6nRBia3d2I0YIRXg" experiments={experiments}>
              <Variant name="titleVariantA">
                {t('abTests.masthead.menu.titleVariantA')}
              </Variant>
              <Variant name="titleVariantB">
                {t('abTests.masthead.menu.titleVariantB')}
              </Variant>
              <Variant name="titleVariantC">
                {t('abTests.masthead.menu.titleVariantC')}
              </Variant>
              <Variant name="" original>
                {t('masthead.menu.title')}
              </Variant>
            </Experiment>
          )}
        </StaticContext.Consumer>
      </TopicMenuButton>
    }
    animation="subtle"
    animationDuration={150}
    backgroundColor="grey"
    noBackdrop
    onClose={onMenuExit}>
    {children}
  </Modal>
);

MastheadMenuModal.propTypes = {
  onMenuExit: PropTypes.func,
};

export default injectT(MastheadMenuModal);
