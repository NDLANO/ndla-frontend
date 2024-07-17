/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ArticleWrapper, LayoutItem, ArticleByline, ArticleFootNotes } from "@ndla/ui";
import { GQLArticleContents_ArticleFragment } from "../../graphqlTypes";
import { Scripts } from "../../util/getArticleScripts";
import { TransformedBaseArticle } from "../../util/transformArticle";
import LicenseBox from "../license/LicenseBox";

interface Props {
  article: TransformedBaseArticle<GQLArticleContents_ArticleFragment>;
  modifier: "clean" | "in-topic";
  oembed: string | undefined;
  scripts?: Scripts[];
}

const ArticleContents = ({ article, modifier = "clean", scripts, oembed }: Props) => {
  return (
    <ArticleWrapper modifier={modifier}>
      {scripts?.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      <LayoutItem layout="extend">{article.transformedContent.content}</LayoutItem>
      <LayoutItem layout="extend">
        {article.transformedContent?.metaData?.footnotes?.length ? (
          <ArticleFootNotes footNotes={article.transformedContent.metaData?.footnotes} />
        ) : undefined}
      </LayoutItem>
      <LayoutItem layout="extend">
        <ArticleByline
          licenseBox={<LicenseBox article={article} oembed={oembed} />}
          {...{
            authors: article.copyright?.creators,
            published: article.published,
            license: article.copyright?.license?.license || "",
          }}
        />
      </LayoutItem>
    </ArticleWrapper>
  );
};

ArticleContents.fragments = {
  article: gql`
    fragment ArticleContents_Article on Article {
      id
      created
      updated
      htmlIntroduction
      transformedContent(transformArgs: $transformArgs) {
        content
        metaData {
          footnotes {
            ref
            authors
            edition
            publisher
            year
            url
            title
          }
        }
      }
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};

export default ArticleContents;
