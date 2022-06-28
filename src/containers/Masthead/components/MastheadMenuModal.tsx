import { ReactNode } from 'react';
import Modal from '@ndla/modal';
//@ts-ignore
import { TopicMenuButton } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useIsNdlaFilm } from '../../../routeHelpers';

interface Props {
  children: (onClose: () => void) => ReactNode;
  onMenuExit?: () => void;
}

const MastheadMenuModal = ({ children, onMenuExit }: Props) => {
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();
  return (
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
};

export default MastheadMenuModal;
