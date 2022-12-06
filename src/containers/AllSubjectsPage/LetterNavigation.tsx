import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { letters } from './utils';

const LetterNavigationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: ${spacing.small};
`;

const StyledLetter = styled(ButtonV2)`
  font-weight: ${fonts.weight.bold};
  min-width: 16px;
  &[disabled] {
    color: ${colors.brand.light};
  }
`;

interface Props {
  activeLetters: string[];
}

const LetterNavigation = ({ activeLetters }: Props) => {
  const onClick = (id: string) => {
    const target = document.getElementById(`subject-${id}`);
    console.log(target);
    target?.focus();
    target?.scrollIntoView({ focu });
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
