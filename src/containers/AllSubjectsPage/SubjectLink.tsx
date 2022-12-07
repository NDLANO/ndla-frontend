import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, fonts } from '@ndla/core';
import { HeartOutline } from '@ndla/icons/action';
import SafeLink from '@ndla/safelink';
import { toSubject } from '../../routeHelpers';
import { Subject } from './interfaces';

interface Props {
  subject: Subject;
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

const SubjectLink = ({ subject }: Props) => {
  return (
    <SubjectLinkWrapper>
      <StyledButton
        aria-label="TEMP: Fjern eller ligg til i favoritter"
        variant="ghost"
        size="xsmall"
        colorTheme="lighter">
        <HeartOutline />
      </StyledButton>
      <StyledSafeLink to={toSubject(subject.id)}>{subject.name}</StyledSafeLink>
    </SubjectLinkWrapper>
  );
};

export default SubjectLink;
