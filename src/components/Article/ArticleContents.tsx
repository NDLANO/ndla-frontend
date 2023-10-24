/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import {
  ArticleWrapper,
  LayoutItem,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleByline,
  ArticleFootNotes,
} from '@ndla/ui';

import LicenseBox from '../license/LicenseBox';
import { TransformedBaseArticle } from '../../util/transformArticle';
import { GQLArticleContents_ArticleFragment } from '../../graphqlTypes';
import { Scripts } from '../../util/getArticleScripts';

interface Props {
  article: TransformedBaseArticle<GQLArticleContents_ArticleFragment>;
  modifier: 'clean' | 'in-topic';
  showIngress: boolean;
  scripts?: Scripts[];
}

const ArticleContents = ({
  article,
  modifier = 'clean',
  showIngress = true,
  scripts,
}: Props) => {
  return (
    <ArticleWrapper modifier={modifier}>
      {scripts?.map((script) => (
        <script
          key={script.src}
          src={script.src}
          type={script.type}
          async={script.async}
          defer={script.defer}
        />
      ))}
      {showIngress && (
        <LayoutItem layout="extend">
          <ArticleHeaderWrapper>
            <ArticleIntroduction>{article.introduction}</ArticleIntroduction>
          </ArticleHeaderWrapper>
        </LayoutItem>
      )}
      <LayoutItem layout="extend">{article.content}</LayoutItem>
      <LayoutItem layout="extend">
        {article.metaData?.footnotes?.length ? (
          <ArticleFootNotes footNotes={article.metaData?.footnotes} />
        ) : undefined}
      </LayoutItem>
      <LayoutItem layout="extend">
        <ArticleByline
          licenseBox={<LicenseBox article={article} />}
          {...{
            authors: article.copyright?.creators,
            published: article.published,
            license: article.copyright?.license?.license || '',
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
      content
      created
      updated
      introduction
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
      ...LicenseBox_Article
    }
    ${LicenseBox.fragments.article}
  `,
};

export default ArticleContents;
