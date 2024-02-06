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
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot } from "@ndla/accordion";
import { colors, spacing } from "@ndla/core";
import { EmbedMetaData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
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

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.tertiary};
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
      <AccordionRoot type="single" collapsible>
        {metadata && hasLicensedContent(metadata) && (
          <AccordionItem value="rulesForUse">
            <StyledAccordionHeader>
              <Text element="span" textStyle="button" margin="none">
                {t("article.useContent")}
              </Text>
            </StyledAccordionHeader>
            <AccordionContent>
              <ResourceEmbedLicenseBox metaData={metadata} />
            </AccordionContent>
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
