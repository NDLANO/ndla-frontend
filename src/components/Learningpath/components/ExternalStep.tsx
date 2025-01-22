/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { ArticleByline, ArticleContent, ArticleFooter, ArticleTitle, ArticleWrapper, ResourceBox } from "@ndla/ui";
import { BaseStepProps, EmbedPageContent } from "./LearningpathStep";
import { GQLLearningpath_LearningpathFragment } from "../../../graphqlTypes";

interface Props extends BaseStepProps {
  learningpath: GQLLearningpath_LearningpathFragment;
}

export const ExternalStep = ({ learningpathStep, skipToContentId, learningpath }: Props) => {
  const { t } = useTranslation();
  const fallbackId = useId();
  return (
    <EmbedPageContent variant="content" css={{ paddingBlock: "medium" }}>
      <ArticleWrapper>
        <ArticleTitle
          title={learningpathStep.title}
          introduction={learningpathStep.introduction}
          id={skipToContentId ?? fallbackId}
          contentType="external"
        />
        <ArticleContent>
          <section>
            <ResourceBox
              title={learningpathStep.opengraph?.title ?? ""}
              caption={learningpathStep.opengraph?.description ?? ""}
              url={learningpathStep.opengraph?.url ?? ""}
              buttonText={t("learningpathPage.externalLink")}
            />
          </section>
        </ArticleContent>
        <ArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} />
        </ArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
