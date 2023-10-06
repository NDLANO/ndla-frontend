/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, fonts, misc, mq, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';

const Header = styled.div`
  display: flex;
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes('20px', '32px')}
  margin-bottom: ${spacing.medium};
`;
const ListWrapper = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  ${mq.range({ from: breakpoints.tablet })} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${mq.range({ from: breakpoints.desktop })} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${mq.range({ from: breakpoints.wide })} {
    grid-column-gap: 35px;
    grid-row-gap: 35px;
  }
`;

export type ListProps = {
  items: ListItemProps[];
  totalCount: number;
};

const MultidisciplinaryArticleList = ({ items, totalCount }: ListProps) => (
  <>
    <Header>{totalCount} caser</Header>
    <ListWrapper>
      {items.map((item) => (
        <ListItem key={item.title} {...item} />
      ))}
    </ListWrapper>
  </>
);

const Image = styled.img`
  width: 100%;
  border-top-left-radius: ${misc.borderRadius};
  border-top-right-radius: ${misc.borderRadius};
`;

const TextWrapper = styled.div`
  border: 1px solid #e6e6e6;
  border-top: 0;
  border-bottom-left-radius: ${misc.borderRadius};
  border-bottom-right-radius: ${misc.borderRadius};
  padding: ${spacing.nsmall} ${spacing.normal};
`;

const Title = styled.h3`
  ${fonts.sizes('18px', '28px')};
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
  margin: 0 0 8px;
`;

const Introduction = styled(Text)`
  color: ${colors.text.primary};
`;

const Subjects = styled.div`
  ${fonts.sizes('14px', '20px')};
  color: ${colors.text.light};
  margin-top: ${spacing.nsmall};
`;

const Subject = styled.span`
  display: block;
`;

interface ListItemProps {
  title: string;
  introduction: string;
  url: string;
  image?: string;
  imageAlt?: string;
  subjects?: string[];
}

const ListItem = ({
  title,
  introduction,
  url,
  image,
  imageAlt = '',
  subjects = [],
}: ListItemProps) => (
  <div>
    <SafeLink to={url}>
      {image && <Image src={image} alt={imageAlt} />}
      <TextWrapper>
        <Title>{title}</Title>
        <Introduction textStyle="meta-text-small">{introduction}</Introduction>
        {subjects.length && (
          <Subjects>
            {subjects.map((subject) => (
              <Subject key={subject}>{subject}</Subject>
            ))}
          </Subjects>
        )}
      </TextWrapper>
    </SafeLink>
  </div>
);

export default MultidisciplinaryArticleList;
