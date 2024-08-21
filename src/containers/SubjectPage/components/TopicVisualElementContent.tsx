/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed, ExternalEmbed, H5pEmbed, IframeEmbed, ImageEmbed } from "@ndla/ui";

interface Props {
  embed: EmbedMetaData;
}

const TopicVisualElementContent = ({ embed }: Props) => {
  if (embed.resource === "image") {
    return <ImageEmbed embed={embed} />;
  } else if (embed.resource === "brightcove") {
    return <BrightcoveEmbed embed={embed} />;
  } else if (embed.resource === "h5p") {
    return <H5pEmbed embed={embed} />;
  } else if (embed.resource === "iframe") {
    return <IframeEmbed embed={embed} />;
  } else if (embed.resource === "external") {
    return <ExternalEmbed embed={embed} />;
  } else {
    return null;
  }
};

export default TopicVisualElementContent;
