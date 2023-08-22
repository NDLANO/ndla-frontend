/**
 * Copyright (C) 2023 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import { ConceptMetaData } from '@ndla/types-embed';
import { ConceptEmbed } from '@ndla/ui';
import { gql } from '@apollo/client';
import {
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionRoot,
} from '@ndla/accordion';
import { useTranslation } from 'react-i18next';
import ResourceEmbedLicenseBox from '../../containers/ResourceEmbed/components/ResourceEmbedLicenseBox';
import { GQLNotionsContent_MetaFragment } from '../../graphqlTypes';
import { hasLicensedContent } from '../../containers/ResourceEmbed/components/ResourceEmbed';

const StyledAccordionHeader = styled(AccordionHeader)`
  background-color: ${colors.brand.lightest};
  border: 1px solid ${colors.brand.tertiary};
  font-size: ${fonts.sizes('16px', '29px')};
  font-weight: ${fonts.weight.semibold};
`;

const RelatedContentContainer = styled.ul`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NotionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: ${spacing.normal};
`;

interface Props {
  embeds: ConceptMetaData[];
  metadata?: GQLNotionsContent_MetaFragment;
  relatedContent?: {
    url: string;
    title: string;
  }[];
}

const NotionsContent = ({ embeds, relatedContent, metadata }: Props) => {
  const { t } = useTranslation();
  return (
    <NotionsWrapper>
      {embeds.map((embed) => (
        <ConceptEmbed key={embed.seq} embed={embed} />
      ))}
      {!!relatedContent?.length && (
        <>
          <h2>{t('related.title')}</h2>
          <RelatedContentContainer>
            {relatedContent.map((content, i) => (
              <li key={`notion-related-item-${i + 1}`}>
                <a href={content.url}>{content.title}</a>
              </li>
            ))}
          </RelatedContentContainer>
        </>
      )}
      <AccordionRoot type="single" collapsible>
        {metadata && hasLicensedContent(metadata) && (
          <AccordionItem value="rulesForUse">
            <StyledAccordionHeader>
              {t('article.useContent')}
            </StyledAccordionHeader>
            <AccordionContent>
              <ResourceEmbedLicenseBox metaData={metadata} />
            </AccordionContent>
          </AccordionItem>
        )}
      </AccordionRoot>
    </NotionsWrapper>
  );
};

NotionsContent.fragments = {
  metadata: gql`
    fragment NotionsContent_Meta on ResourceMetaData {
      ...ResourceEmbedLicenseBox_Meta
    }
    ${ResourceEmbedLicenseBox.fragments.metaData}
  `,
};

export default NotionsContent;
