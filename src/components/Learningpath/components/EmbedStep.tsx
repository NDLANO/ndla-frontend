/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Badge } from "@ndla/primitives";
import { ArticleWrapper, ArticleTitle, ArticleContent, ExternalEmbed } from "@ndla/ui";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { GQLLearningpathStepOembedFragment } from "../../../graphqlTypes";
import { urlIsNDLAUrl } from "../../../util/ndlaUrl";
import { InactiveMessageBox } from "../../InactiveMessageBox";
import { ResourceContent } from "../../Resource/ResourceLayout";
import { RestrictedBlock } from "../../RestrictedBlock";
import { useRestrictedMode } from "../../RestrictedModeContext";
import { LearningpathIframe } from "../LearningpathIframe";

interface EmbedStepProps {
  url: string;
  title: string;
  oembed: GQLLearningpathStepOembedFragment;
  isInactive?: boolean;
  skipToContentId?: string;
}

export const EmbedStep = ({ skipToContentId, url, title, oembed, isInactive }: EmbedStepProps) => {
  const fallbackId = useId();
  const { t } = useTranslation();
  const restrictedInfo = useRestrictedMode();

  if (urlIsNDLAUrl(url) && oembed?.html) {
    return <LearningpathIframe url={url} html={oembed.html} />;
  }

  return (
    <ResourceContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          badges={<Badge>{t("contentTypes.external")}</Badge>}
          title={title}
        />
        {!!isInactive && <InactiveMessageBox />}
        <ArticleContent>
          {restrictedInfo.restricted ? (
            <RestrictedBlock />
          ) : (
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
          )}
        </ArticleContent>
      </ArticleWrapper>
    </ResourceContent>
  );
};
