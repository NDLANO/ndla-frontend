/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { CardContent, CardHeading, CardImage, CardRoot, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadge } from "@ndla/ui";

const StyledCardRoot = styled(CardRoot, {
  base: {
    height: "100%",
    width: "360px",
  },
});

interface Props {
  title: string;
  url: string;
  ingress: string;
  contentType?: string;
  metaImage?: {
    url?: string;
    alt?: string;
  };
  subjects?: {
    url?: string;
    title?: string;
  }[];
  breadcrumbs?: string[];
}

export const MovedNodeCard = ({ title, url, ingress, breadcrumbs, contentType, metaImage }: Props) => {
  return (
    <StyledCardRoot>
      {!!metaImage?.url && <CardImage alt={metaImage.alt ?? ""} src={metaImage.url} />}
      <CardContent>
        <ContentTypeBadge contentType={contentType} />
        <CardHeading asChild consumeCss>
          <SafeLink to={url} unstyled css={linkOverlay.raw()}>
            {title}
          </SafeLink>
        </CardHeading>
        {!!ingress && <Text>{parse(ingress)}</Text>}
        {!!breadcrumbs && (
          <Text color="text.subtle" textStyle="label.small">
            {breadcrumbs.join(" › ")}
          </Text>
        )}
      </CardContent>
    </StyledCardRoot>
  );
};
