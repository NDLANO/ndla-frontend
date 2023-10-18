/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Heading, Text } from '@ndla/typography';
import { Link } from 'react-router-dom';
import { GQLPodcastSeries_PodcastSeriesSummaryFragment } from '../../graphqlTypes';

const StyledCoverPhoto = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
`;

const FlexWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  margin: ${spacing.medium};
`;

const ImageWrapper = styled.div`
  width: 125px;
  padding: ${spacing.small};
  margin-right: ${spacing.medium};
  border: 1px solid ${colors.brand.greyLight};
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledDescription = styled(Text)`
  max-width: 600px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PodcastSeries = ({
  coverPhoto,
  description,
  title,
  id,
}: GQLPodcastSeries_PodcastSeriesSummaryFragment) => {
  return (
    <FlexWrapper>
      <ImageWrapper>
        <StyledCoverPhoto src={coverPhoto.url} alt={coverPhoto.altText} />
      </ImageWrapper>
      <TextWrapper>
        <div>
          <Heading headingStyle="default" element="h3" margin="none">
            <Link to={`/podkast/${id}`}>{title.title}</Link>
          </Heading>
        </div>
        <StyledDescription textStyle="meta-text-small" margin="none">
          {description.description}
        </StyledDescription>
      </TextWrapper>
    </FlexWrapper>
  );
};

PodcastSeries.fragments = {
  series: gql`
    fragment PodcastSeries_PodcastSeriesSummary on PodcastSeriesSummary {
      id
      title {
        title
      }
      description {
        description
      }
      coverPhoto {
        url
        altText
      }
    }
  `,
};

export default PodcastSeries;
