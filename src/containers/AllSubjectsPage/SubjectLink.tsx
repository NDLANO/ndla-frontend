import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { Heart, HeartOutline } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthenticationContext';
import { toSubject } from '../../routeHelpers';
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
  const { authenticated } = useContext(AuthContext);
  const { updatePersonalData } = useUpdatePersonalData();

  const toggleFavorite = (value: boolean) => {
    if (!authenticated) {
      openLoginModal?.();
      return;
    }
    if (!favorites) {
      return;
    }
    if (value) {
      const newFavorites = favorites?.filter(
        favorite => favorite !== subject.id,
      );
      updatePersonalData({ variables: { favoriteSubjects: newFavorites } });
    } else {
      const newFavorites = favorites.concat(subject.id);
      updatePersonalData({ variables: { favoriteSubjects: newFavorites } });
    }
  };

  return (
    <SubjectLinkWrapper>
      <StyledButton
        onClick={() => toggleFavorite(isFavorite)}
        aria-label="TEMP: Fjern eller ligg til i favoritter"
        variant="ghost"
        size="xsmall"
        colorTheme="lighter">
        {isFavorite ? <Heart /> : <HeartOutline />}
      </StyledButton>
      <StyledSafeLink to={toSubject(subject.id)}>{subject.name}</StyledSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;
