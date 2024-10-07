/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Image } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedMetaData } from "@ndla/types-embed";
import { EmbedByline, ImageEmbed } from "@ndla/ui";
import { GQLArticle } from "../../../graphqlTypes";

interface Props {
  embed: EmbedMetaData;
  metaImage?: GQLArticle["metaImage"];
}

const StyledFigure = styled("figure", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

const TopicVisualElementContent = ({ embed, metaImage }: Props) => {
  if (embed.resource === "image") {
    return <ImageEmbed embed={{ ...embed, embedData: { ...embed.embedData, caption: "" } }} />;
  } else if (!metaImage) {
    return null;
  } else {
    return (
      <StyledFigure>
        <Image src={metaImage?.url ?? ""} alt={metaImage?.alt ?? ""} />
        {metaImage.copyright ? (
          <EmbedByline
            type="image"
            copyright={{ ...metaImage.copyright, processed: !!metaImage.copyright.processed }}
            hideDescription
          />
        ) : null}
      </StyledFigure>
    );
  }
};

export default TopicVisualElementContent;
