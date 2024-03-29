/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { breakpoints, colors, fonts, mq, spacing } from "@ndla/core";
import { Heading } from "@ndla/typography";
import { OneColumn } from "@ndla/ui";
import ResourceBadge from "./ResourceBadge";
import { SKIP_TO_CONTENT_ID } from "../../../constants";

export type EmbedType = "video" | "audio" | "podcast" | "image" | "h5p" | "concept" | "gloss";

interface Props {
  children: ReactNode;
  title: string;
  type: EmbedType;
  noBackground?: boolean;
}

const TitleWrapper = styled.div`
  display: flex;
  gap: ${spacing.medium};
  align-items: flex-start;
  h1 {
    margin: 0;
  }
`;

const StyledEmbedTypeHeader = styled(Heading)`
  font-weight: ${fonts.weight.semibold};
  color: ${colors.text.light};
`;

const ResourceHero = styled.div`
  padding-bottom: 156px;
  min-height: 246px;
  background-color: ${colors.brand.greyLight};
  ${mq.range({ until: breakpoints.tablet })} {
    min-height: 100px;
  }
`;

const StyledArticle = styled.article`
  border: 2px solid ${colors.subjectMaterial.light};
  background-color: ${colors.white};
  padding: 65px 100px;

  ${mq.range({ until: breakpoints.tablet })} {
    padding: ${spacing.normal};
    border: none;
  }

  ${mq.range({ from: breakpoints.tablet, until: breakpoints.desktop })} {
    padding: 65px 70px;
  }

  &[data-no-background="false"] {
    margin-top: -144px;
    ${mq.range({ until: breakpoints.tablet })} {
      margin-top: -44px;
    }
  }

  &[data-no-background="true"] {
    border: none;
    padding: 20px 80px;
    ${mq.range({ until: breakpoints.desktop })} {
      padding: 0px 30px;
    }
  }

  figure {
    inset: 0;
    padding: 0;
    width: 100% !important;
  }
`;

const StyledOneColumn = styled(OneColumn)`
  ${mq.range({ until: breakpoints.tablet })} {
    padding: 0;
  }
`;

const ResourceEmbedWrapper = ({ children, type, title, noBackground = false }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {!noBackground && <ResourceHero />}
      <StyledOneColumn>
        <StyledArticle data-no-background={noBackground}>
          <TitleWrapper>
            <ResourceBadge type={type} />
            <hgroup>
              <StyledEmbedTypeHeader element="p" headingStyle="list-title" margin="none">
                {t(`embed.type.${type}`)}
              </StyledEmbedTypeHeader>
              <Heading element="h1" headingStyle="h1-resource" id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
                {title}
              </Heading>
            </hgroup>
          </TitleWrapper>
          {children}
        </StyledArticle>
      </StyledOneColumn>
    </>
  );
};

export default ResourceEmbedWrapper;
