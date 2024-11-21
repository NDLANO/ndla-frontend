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
  metaImage?: {
    url?: string;
    alt?: string;
  };
}

// This is styled in TransportationPageHeader
export const TransportationPageVisualElement = ({ embed, metaImage }: Props) => {
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
  } else if (metaImage?.url) {
    return (
      <Figure>
        <Image src={metaImage.url} alt={metaImage.alt ?? ""} width={365} />
      </Figure>
    );
  }
  return null;
};
