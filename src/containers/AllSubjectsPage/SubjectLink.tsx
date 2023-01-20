/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { Heart, HeartOutline } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import Tooltip from '@ndla/tooltip';
import { useSnack } from '@ndla/ui';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../components/AuthenticationContext';
import LoginModal from '../../components/MyNdla/LoginModal';
import { toSubject } from '../../routeHelpers';
import DeleteModal from '../MyNdla/components/DeleteModal';
import { useUpdatePersonalData } from '../MyNdla/userMutations';
import { Subject } from './interfaces';

const SubjectLinkWrapper = styled.li`
  display: flex;
  align-items: center;
  gap: ${spacing.xsmall};
`;

const StyledIconButton = styled(IconButtonV2)`
  min-height: 40px;
  min-width: 40px;
`;

const SubjectSafeLink = styled(SafeLink)`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
  box-shadow: none;
  :hover {
    box-shadow: ${misc.textLinkBoxShadow};
  }
  color: ${colors.brand.primary};
`;

const ModalSubjectContainer = styled.div`
  margin-top: ${spacing.normal};
  padding: ${spacing.small};
  border: 1px solid ${colors.brand.neutral7};
  border-radius: ${misc.borderRadius};
`;

interface Props {
  subject: Subject;
  favorites: string[] | undefined;
}

const SubjectLink = ({ subject, favorites }: Props) => {
  const isFavorite = !!favorites?.includes(subject.id);
  const { addSnack } = useSnack();
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { authenticated } = useContext(AuthContext);
  const { updatePersonalData } = useUpdatePersonalData();

  const setFavorite = async (isFavorite: boolean) => {
    if (!authenticated) {
      setShowLoginModal(true);
      return;
    }
    if (!favorites) {
      return;
    }
    if (isFavorite) {
      setShowDeleteModal(true);
    } else {
      const newFavorites = favorites.concat(subject.id);
      await updatePersonalData({
        variables: { favoriteSubjects: newFavorites },
      });
      addSnack({
        id: `addedFavorite-${subject.id}`,
        content: t('subjectsPage.addConfirmed', { subject: subject.name }),
      });
    }
  };

  const removeFavorite = async () => {
    if (!favorites) {
      return;
    }
    const newFavorites = favorites?.filter(favorite => favorite !== subject.id);
    await updatePersonalData({ variables: { favoriteSubjects: newFavorites } });
    setShowDeleteModal(false);
    addSnack({
      id: `removedFavorite-${subject.id}`,
      content: t('subjectsPage.removeConfirmed', { subject: subject.name }),
    });
  };

  return (
    <SubjectLinkWrapper>
      <Tooltip
        tooltip={t(
          `subjectsPage.${isFavorite ? 'removeFavorite' : 'addFavorite'}`,
        )}>
        <StyledIconButton
          onClick={() => setFavorite(isFavorite)}
          aria-label={`${t(
            `subjectsPage.${isFavorite ? 'removeFavorite' : 'addFavorite'}`,
          )}, ${subject.name}`}
          variant="ghost"
          size="xsmall"
          colorTheme="lighter">
          {isFavorite ? <Heart /> : <HeartOutline />}
        </StyledIconButton>
      </Tooltip>
      <SubjectSafeLink to={toSubject(subject.id)}>
        {subject.name}
      </SubjectSafeLink>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={removeFavorite}
        title={t('subjectsPage.removeFavorite')}
        removeText={t('myNdla.resource.remove')}
        description={t('subjectsPage.confirmRemove', { subject: subject.name })}
      />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title={t('subjectsPage.subjectFavoritePitch')}
        content={
          <>
            <span>{t('subjectsPage.subjectFavoriteGuide')}</span>
            <ModalSubjectContainer>
              <SubjectSafeLink to={toSubject(subject.id)}>
                {subject.name}
              </SubjectSafeLink>
            </ModalSubjectContainer>
          </>
        }
      />
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;
