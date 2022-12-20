import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { Heart, HeartOutline } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { useSnack } from '@ndla/ui';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import { toSubject } from '../../routeHelpers';
import DeleteModal from '../MyNdla/components/DeleteModal';
import { useUpdatePersonalData } from '../MyNdla/userMutations';
import { Subject } from './interfaces';

const SubjectLinkWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledButton = styled(IconButtonV2)`
  min-height: 40px;
  min-width: 40px;
`;

const StyledSafeLink = styled(SafeLink)`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
  box-shadow: none;
  color: ${colors.brand.primary};
`;

interface Props {
  subject: Subject;
  favorites: string[] | undefined;
  openLoginModal?: () => void;
}

const SubjectLink = ({ subject, favorites, openLoginModal }: Props) => {
  const isFavorite = !!favorites?.includes(subject.id);
  const { addSnack } = useSnack();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { authenticated } = useContext(AuthContext);
  const { updatePersonalData } = useUpdatePersonalData();

  const setFavorite = async (value: boolean) => {
    if (!authenticated) {
      openLoginModal?.();
      return;
    }
    if (!favorites) {
      return;
    }
    if (value) {
      setShowDeleteModal(true);
    } else {
      const newFavorites = favorites.concat(subject.id);
      await updatePersonalData({
        variables: { favoriteSubjects: newFavorites },
      });
      addSnack({
        id: `addedFavorite-${subject.id}`,
        content: t('subjectsPage.confirmAdded', { subject: subject.name }),
      });
    }
  };

  const removeFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites?.filter(favorite => favorite !== subject.id);
    await updatePersonalData({ variables: { favoriteSubjects: newFavorites } });
    addSnack({
      id: `removedFavorite-${subject.id}`,
      content: t('subjectsPage.confirmRemoved', { subject: subject.name }),
    });
  };

  return (
    <SubjectLinkWrapper>
      <Tooltip
        tooltip={t(
          `subjectsPage.${isFavorite ? 'removeFavorite' : 'addFavorite'}`,
        )}>
        <StyledButton
          onClick={() => setFavorite(isFavorite)}
          aria-label={t(
            `subjectsPage.${isFavorite ? 'removeFavorite' : 'addFavorite'}`,
          )}
          variant="ghost"
          size="xsmall"
          colorTheme="lighter">
          {isFavorite ? <Heart /> : <HeartOutline />}
        </StyledButton>
      </Tooltip>
      <StyledSafeLink to={toSubject(subject.id)}>{subject.name}</StyledSafeLink>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={removeFavorite}
        title={t('subjectsPage.removeFavorite')}
        removeText={t('myNdla.resource.remove')}
        description={t('subjectsPage.confirmRemove', { subject: subject.name })}
      />
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;
