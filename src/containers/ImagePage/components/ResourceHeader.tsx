import styled from '@emotion/styled';
import { spacing, fonts, mq, breakpoints } from '@ndla/core';
import { SKIP_TO_CONTENT_ID } from '../../../constants';

export const StyledResourceHeader = styled.h1`
  margin: ${spacing.medium} ${spacing.normal} ${spacing.normal} 0;
  ${fonts.sizes('24px', '28px')}
  ${mq.range({ from: breakpoints.tablet })} {
    margin: 40px ${spacing.normal} 18px 0;
    ${fonts.sizes('32px', '28px')};
  }
  ${mq.range({ from: breakpoints.desktop })} {
    margin: 60px ${spacing.normal} 24px 0;
    ${fonts.sizes('52px', '65px')};
  }
`;

interface Props {
  title: string;
}

const ResourceHeader = ({ title }: Props) => (
  <StyledResourceHeader id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
    {title}
  </StyledResourceHeader>
);

export default ResourceHeader;
