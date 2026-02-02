/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { breakpoints } from "@ndla/core";
import { Badge, ListItemContent, ListItemHeading, ListItemRoot, Text, ListItemImage } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useTranslation } from "react-i18next";
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

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    gap: "4xsmall",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});

export const PodcastSeries = ({
  coverPhoto,
  description,
  title,
  id,
}: GQLPodcastSeries_PodcastSeriesSummaryFragment) => {
  const { t } = useTranslation();
  return (
    <ListItemRoot asChild consumeCss>
      <li>
        {/* TODO: Image variants */}
        <BigListItemImage
          alt={coverPhoto.altText}
          src={coverPhoto.url}
          sizes={`(max-width: ${breakpoints.tablet}) 144px, 200px`}
          fallbackElement={<Badge>{t("contentTypes.podcast")}</Badge>}
        />
        <StyledListItemContent>
          <ListItemHeading asChild consumeCss css={linkOverlay.raw()}>
            <SafeLink to={`/podkast/${id}`}>{title.title}</SafeLink>
          </ListItemHeading>
          <StyledText>{description.description}</StyledText>
        </StyledListItemContent>
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
