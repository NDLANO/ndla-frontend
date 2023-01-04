import styled from '@emotion/styled';
import { buttonStyleV2 } from '@ndla/button';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import { letters } from './utils';

const LetterNavigationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: ${spacing.small};
  margin: ${spacing.medium} 0;
  ${mq.range({ until: breakpoints.tabletWide })} {
    gap: ${spacing.medium};
  }
`;

interface StyledProps {
  disabled?: boolean;
}

const StyledLetter = styled.a<StyledProps>`
  ${buttonStyleV2({ colorTheme: 'lighter', variant: 'ghost' })}
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.bold};
  min-width: 20px;
  min-height: unset;
  padding: 0;
  box-shadow: inset 0 -1px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;

  &[disabled],
  &[disabled]:focus {
    background: none;
    box-shadow: none;
    outline: none;
    border: none;
    color: ${colors.brand.light};
    cursor: unset;
  }
  :hover,
  :focus {
    box-shadow: none;
    border-bottom-left-radius: ${misc.borderRadius};
    border-bottom-right-radius: ${misc.borderRadius};
  }
  :focus {
    background: ${colors.brand.primary};
    color: ${colors.white};
    outline: none;
    border-color: ${colors.brand.primary};
  }
  ${mq.range({ until: breakpoints.tabletWide })} {
    ${fonts.sizes('24px', '24px')};
    box-shadow: inset 0 -2px;
    min-height: 48px;
    min-width: 48px;
  }
`;

interface Props {
  activeLetters: string[];
}

const LetterNavigation = ({ activeLetters }: Props) => {
  return (
    <LetterNavigationWrapper>
      {letters.map(letter => {
        const enabled = activeLetters.includes(letter);
        return (
          <StyledLetter
            href={enabled ? `#subject-${letter}` : undefined}
            disabled={!enabled}
            tabIndex={enabled ? 0 : -1}
            key={letter}>
            {letter}
          </StyledLetter>
        );
      })}
    </LetterNavigationWrapper>
  );
};

export default LetterNavigation;
