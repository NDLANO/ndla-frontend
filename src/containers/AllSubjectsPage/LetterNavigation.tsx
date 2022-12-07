import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { letters } from './utils';

const LetterNavigationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: ${spacing.small};
  margin: ${spacing.medium} 0;
`;

const StyledLetter = styled(ButtonV2)`
  font-weight: ${fonts.weight.bold};
  min-width: 18px;
  &[disabled] {
    color: ${colors.brand.light};
    cursor: unset;
  }
`;

interface Props {
  activeLetters: string[];
}

const LetterNavigation = ({ activeLetters }: Props) => {
  const onClick = (id: string) => {
    const container = document.getElementById(`subject-${id}`);
    const target = container?.querySelector('a');
    target?.focus();
  };

  return (
    <LetterNavigationWrapper>
      {letters.map(letter => {
        const active = activeLetters.includes(letter);
        return (
          <StyledLetter
            onClick={() => onClick(letter)}
            disabled={!active}
            variant="link"
            key={letter}>
            {letter}
          </StyledLetter>
        );
      })}
    </LetterNavigationWrapper>
  );
};

export default LetterNavigation;
