import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal';
//@ts-ignore
import { TopicMenuButton } from '@ndla/ui';
import { WithTranslation, withTranslation } from 'react-i18next';

interface Props {
  children: (onClose: () => void) => React.ReactNode;
  onMenuExit?: () => void;
  ndlaFilm?: boolean;
}

const MastheadMenuModal = ({
  children,
  onMenuExit,
  t,
  ndlaFilm,
}: Props & WithTranslation) => (
  <Modal
    size="fullscreen"
    activateButton={
      <TopicMenuButton data-testid="masthead-menu-button" ndlaFilm={ndlaFilm}>
        {t('masthead.menu.title')}
      </TopicMenuButton>
    }
    animation="subtle"
    animationDuration={150}
    backgroundColor="grey"
    onClose={onMenuExit}>
    {children}
  </Modal>
);

MastheadMenuModal.propTypes = {
  onMenuExit: PropTypes.func,
  ndlaFilm: PropTypes.bool,
};

export default withTranslation()(MastheadMenuModal);
