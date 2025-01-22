/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { ArticleWrapper, ArticleTitle, ArticleContent, ExternalEmbed } from "@ndla/ui";
import { GQLLearningpathEmbed_LearningpathStepFragment } from "../../../graphqlTypes";
import LearningpathIframe, { urlIsNDLAUrl } from "../LearningpathIframe";
import { EmbedPageContent } from "./LearningpathStep";

interface EmbedStepProps {
  url: string;
  title: string;
  oembed: GQLLearningpathEmbed_LearningpathStepFragment["oembed"];
  skipToContentId?: string;
}

export const EmbedStep = ({ skipToContentId, url, title, oembed }: EmbedStepProps) => {
  const fallbackId = useId();

  if (urlIsNDLAUrl(url) && oembed?.html) {
    return <LearningpathIframe url={url} html={oembed.html} />;
  }

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle id={skipToContentId ?? fallbackId} contentType="external" title={title} />
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
