/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { breakpoints } from "@ndla/core";
import { ListItemContent, ListItemHeading, ListItemRoot, Text, ListItemImage } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { GQLPodcastSeries_PodcastSeriesSummaryFragment } from "../../graphqlTypes";

const StyledText = styled(Text, { base: { lineClamp: "3" } });

const BigListItemImage = styled(ListItemImage, {
  base: {
    maxWidth: "surface.4xsmall",
    minWidth: "surface.4xsmall",
    maxHeight: "surface.4xsmall",
    minHeight: "surface.4xsmall",
    tabletDown: {
      maxWidth: "3xlarge",
      minWidth: "3xlarge",
      maxHeight: "3xlarge",
      minHeight: "3xlarge",
    },
  },
});

const PodcastSeries = ({ coverPhoto, description, title, id }: GQLPodcastSeries_PodcastSeriesSummaryFragment) => {
  return (
    <ListItemRoot asChild consumeCss variant="list">
      <li>
        <BigListItemImage
          alt={coverPhoto.altText}
          src={coverPhoto.url}
          sizes={`(max-width: ${breakpoints.tablet}) 144px, 200px`}
        />
        <ListItemContent>
          <div>
            <ListItemHeading asChild consumeCss>
              <h3>
                <SafeLink to={`/podkast/${id}`} css={linkOverlay.raw()}>
                  {title.title}
                </SafeLink>
              </h3>
            </ListItemHeading>
            <StyledText>{description.description}</StyledText>
          </div>
        </ListItemContent>
      </li>
    </ListItemRoot>
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
