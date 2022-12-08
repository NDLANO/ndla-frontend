import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts } from '@ndla/core';
import { Heart, HeartOutline } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import { toSubject } from '../../routeHelpers';
import { useUpdatePersonalData } from '../MyNdla/userMutations';
import { Subject } from './interfaces';

interface Props {
  subject: Subject;
  favorites: string[] | undefined;
}

const SubjectLinkWrapper = styled.div`
  display: flex;
  align-items: center;
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

const SubjectLink = ({ subject, favorites }: Props) => {
  const isFavorite = !!favorites?.includes(subject.id);
  const { updatePersonalData } = useUpdatePersonalData();

  const toggleFavorite = (value: boolean) => {
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
