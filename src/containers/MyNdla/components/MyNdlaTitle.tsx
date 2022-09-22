import styled from '@emotion/styled';
import { breakpoints, fonts, mq } from '@ndla/core';
import { SKIP_TO_CONTENT_ID } from '../../../constants';

const StyledTitle = styled.h1`
  margin: 0;
  padding: 0;
  ${fonts.sizes('28px', '28px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px', '20px')};
  }
`;

interface Props {
  title: string;
}

const MyNdlaTitle = ({ title }: Props) => {
  return <StyledTitle id={SKIP_TO_CONTENT_ID}>{title}</StyledTitle>;
};

export default MyNdlaTitle;
