/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Figure, Image } from "@ndla/primitives";
import { EmbedMetaData } from "@ndla/types-embed";
import { ImageEmbed } from "@ndla/ui";

interface Props {
  embed?: EmbedMetaData;
  imageUrl?: string;
  imageAlt?: string;
}

// This is styled in TransportationPageHeader
export const TransportationPageVisualElement = ({ embed, imageUrl, imageAlt }: Props) => {
  if (embed?.resource === "image") {
    return (
      <ImageEmbed
        embed={{
          ...embed,
          embedData: {
            ...embed.embedData,
            hideByline: "true",
            caption: "",
          },
        }}
      />
    );
  } else if (imageUrl) {
    return (
      <Figure>
        <Image src={imageUrl} alt={imageAlt ?? ""} width={365} fetchPriority="high" />
      </Figure>
    );
  }
  return null;
};
