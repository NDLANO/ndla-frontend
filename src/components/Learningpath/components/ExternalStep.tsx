/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { Badge } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper, ResourceBox } from "@ndla/ui";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import type {
  GQLExternalStep_LearningpathFragment,
  GQLExternalStep_LearningpathStepFragment,
} from "../../../graphqlTypes";
import { InactiveMessageBox } from "../../InactiveMessageBox";
import { ResourceContent } from "../../Resource/ResourceLayout";
import { RestrictedBlock } from "../../RestrictedBlock";
import { useRestrictedMode } from "../../RestrictedModeContext";

const StyledArticleFooter = styled(ArticleFooter, {
  base: {
    "& > :is(:last-child)": {
      paddingBlockEnd: "xxlarge",
    },
  },
});

interface Props {
  learningpath: GQLExternalStep_LearningpathFragment;
  isInactive?: boolean;
  skipToContentId?: string;
  learningpathStep: GQLExternalStep_LearningpathStepFragment;
}

export const ExternalStep = ({ learningpathStep, skipToContentId, learningpath, isInactive }: Props) => {
  const { t } = useTranslation();
  const fallbackId = useId();
  const restrictedInfo = useRestrictedMode();
  return (
    <ResourceContent variant="content" css={{ paddingBlock: "medium" }}>
      <ArticleWrapper>
        <ArticleTitle
          title={learningpathStep.title}
          introduction={learningpathStep.introduction}
          id={skipToContentId ?? fallbackId}
          badges={<Badge>{t("contentTypes.external")}</Badge>}
        />
        {!!isInactive && <InactiveMessageBox />}
        <ArticleContent>
          {restrictedInfo.restricted ? (
            <RestrictedBlock />
          ) : (
            <section>
              <ResourceBox
                title={learningpathStep.opengraph?.title ?? ""}
                caption={learningpathStep.opengraph?.description ?? ""}
                url={learningpathStep.opengraph?.url ?? learningpathStep.embedUrl?.url ?? ""}
                buttonText={t("learningpathPage.externalLink")}
              />
            </section>
          )}
        </ArticleContent>
        {!restrictedInfo.restricted && (
          <StyledArticleFooter>
            <ArticleByline authors={learningpath.copyright.contributors} bylineType="external" />
          </StyledArticleFooter>
        )}
      </ArticleWrapper>
    </ResourceContent>
  );
};

ExternalStep.fragments = {
  learningpathStep: gql`
    fragment ExternalStep_LearningpathStep on BaseLearningpathStep {
      id
      title
      introduction
      opengraph {
        title
        description
        url
      }
      embedUrl {
        url
      }
    }
  `,
  learningpath: gql`
    fragment ExternalStep_Learningpath on BaseLearningpath {
      copyright {
        contributors {
          type
          name
        }
      }
    }
  `,
};
