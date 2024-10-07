/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Image } from "@ndla/primitives";
import { EmbedMetaData } from "@ndla/types-embed";
import { ImageEmbed } from "@ndla/ui";
import { GQLArticle } from "../../../graphqlTypes";

interface Props {
  embed: EmbedMetaData;
  metaImage: GQLArticle["metaImage"];
}

const TopicVisualElementContent = ({ embed, metaImage }: Props) => {
  if (embed.resource === "image") {
    return <ImageEmbed embed={{ ...embed, embedData: { ...embed.embedData, caption: "" } }} />;
  } else if (!metaImage) {
    return null;
  } else {
    return (
      <figure>
        <Image src={metaImage?.url ?? ""} alt={metaImage?.alt ?? ""} />
      </figure>
    );
  }
};

export default TopicVisualElementContent;
