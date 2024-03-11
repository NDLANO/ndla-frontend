/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, misc, mq, spacing } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { GQLMultidisciplinaryArticleList_TopicFragment } from "../../../graphqlTypes";

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
  topics: GQLMultidisciplinaryArticleList_TopicFragment[];
  totalCount: number;
  subjects: string[];
};

const MultidisciplinaryArticleList = ({ topics, totalCount, subjects }: ListProps) => (
  <>
    <Heading headingStyle="default" element="h2">
      {totalCount} caser
    </Heading>
    <ListWrapper>
      {topics.map((topic) => (
        <ListItem key={topic.name} topic={topic} subjects={subjects} />
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
  ${fonts.sizes("18px", "28px")};
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
  margin: 0 0 8px;
`;

const Introduction = styled(Text)`
  color: ${colors.text.primary};
`;

const Subjects = styled(Text)`
  color: ${colors.text.primary};
  margin-top: ${spacing.nsmall};
`;

const Subject = styled.span`
  display: block;
`;

interface ListItemProps {
  topic: GQLMultidisciplinaryArticleList_TopicFragment;
  subjects: string[];
}

const ListItem = ({ topic, subjects }: ListItemProps) => (
  <div>
    <SafeLink to={topic.path ?? ""}>
      {!!topic.meta?.metaImage && <Image src={topic.meta.metaImage.url} alt={topic.meta.metaImage.alt} />}
      <TextWrapper>
        <Title>{topic.name}</Title>
        <Introduction textStyle="meta-text-small">{topic.meta?.metaDescription ?? ""}</Introduction>
        {!!subjects.length && (
          <Subjects textStyle="meta-text-small" margin="none">
            {subjects.map((subject) => (
              <Subject key={subject}>{subject}</Subject>
            ))}
          </Subjects>
        )}
      </TextWrapper>
    </SafeLink>
  </div>
);

MultidisciplinaryArticleList.fragments = {
  topic: gql`
    fragment MultidisciplinaryArticleList_Topic on Topic {
      name
      id
      path
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
    }
  `,
};

export default MultidisciplinaryArticleList;
