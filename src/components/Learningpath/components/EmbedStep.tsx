/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@ndla/primitives";
import { ArticleWrapper, ArticleTitle, ArticleContent, ExternalEmbed } from "@ndla/ui";
import { GQLLearningpathStepOembedFragment } from "../../../graphqlTypes";
import { LearningpathIframe } from "../LearningpathIframe";
import { EmbedPageContent } from "./EmbedPageContent";
import { urlIsNDLAUrl } from "../../../util/ndlaUrl";

interface EmbedStepProps {
  url: string;
  title: string;
  oembed: GQLLearningpathStepOembedFragment;
  skipToContentId?: string;
}

export const EmbedStep = ({ skipToContentId, url, title, oembed }: EmbedStepProps) => {
  const fallbackId = useId();
  const { t } = useTranslation();

  if (urlIsNDLAUrl(url) && oembed?.html) {
    return <LearningpathIframe url={url} html={oembed.html} />;
  }

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          badges={<Badge>{t("contentTypes.external")}</Badge>}
          title={title}
        />
        <ArticleContent>
          <section>
            <ExternalEmbed
              embed={{
                resource: "external",
                status: "success",
                embedData: {
                  resource: "external",
                  url,
                },
                data: {
                  oembed,
                },
              }}
            />
          </section>
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
