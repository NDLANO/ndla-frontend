/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ArrowDownShortLine } from "@ndla/icons/common";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
} from "@ndla/primitives";
import { EmbedMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed, ExternalEmbed, H5pEmbed, IframeEmbed, ImageEmbed } from "@ndla/ui";
import { GQLTopicVisualElementContent_MetaFragment } from "../../../graphqlTypes";
import { hasLicensedContent } from "../../ResourceEmbed/components/ResourceEmbed";
import ResourceEmbedLicenseBox from "../../ResourceEmbed/components/ResourceEmbedLicenseBox";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: ${spacing.normal};
`;

interface Props {
  embed: EmbedMetaData;
  metadata: GQLTopicVisualElementContent_MetaFragment;
}

const TopicVisualElementContent = ({ embed, metadata }: Props) => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      {embed.resource === "image" ? (
        <ImageEmbed embed={embed} />
      ) : embed.resource === "brightcove" ? (
        <BrightcoveEmbed embed={embed} />
      ) : embed.resource === "h5p" ? (
        <H5pEmbed embed={embed} />
      ) : embed.resource === "iframe" ? (
        <IframeEmbed embed={embed} />
      ) : embed.resource === "external" ? (
        <ExternalEmbed embed={embed} />
      ) : null}
      <AccordionRoot multiple>
        {metadata && hasLicensedContent(metadata) && (
          <AccordionItem value="rulesForUse">
            <Heading asChild consumeCss fontWeight="bold" textStyle="label.medium">
              <h2>
                <AccordionItemTrigger>
                  {t("article.useContent")}
                  <AccordionItemIndicator asChild>
                    <ArrowDownShortLine size="medium" />
                  </AccordionItemIndicator>
                </AccordionItemTrigger>
              </h2>
            </Heading>
            <AccordionItemContent>
              <ResourceEmbedLicenseBox metaData={metadata} />
            </AccordionItemContent>
          </AccordionItem>
        )}
      </AccordionRoot>
    </Wrapper>
  );
};

TopicVisualElementContent.fragments = {
  metadata: gql`
    fragment TopicVisualElementContent_Meta on ResourceMetaData {
      ...ResourceEmbedLicenseBox_Meta
    }
    ${ResourceEmbedLicenseBox.fragments.metaData}
  `,
};

export default TopicVisualElementContent;
