import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, misc, spacing } from '@ndla/core';
import { letters } from './utils';

const LetterNavigationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: ${spacing.small};
  margin: ${spacing.medium} 0;
`;

const StyledLetter = styled(ButtonV2)`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  min-width: 20px;
  min-height: unset;
  padding: 0;
  box-shadow: inset 0 -1px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  &[disabled] {
    box-shadow: none;
    color: ${colors.brand.light};
    cursor: unset;
  }
  :hover,
  :focus {
    box-shadow: none;
    border-bottom-left-radius: ${misc.borderRadius};
    border-bottom-right-radius: ${misc.borderRadius};
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
            variant="ghost"
            colorTheme="lighter"
            key={letter}>
            {letter}
          </StyledLetter>
        );
      })}
    </LetterNavigationWrapper>
  );
};

export default LetterNavigation;
