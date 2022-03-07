/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { Remarkable } from 'remarkable';
import {
  ArticleWrapper,
  LayoutItem,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleByline,
  ArticleContent,
  ArticleFootNotes,
} from '@ndla/ui';

import LicenseBox from '../license/LicenseBox';
import { transformArticle } from '../../util/transformArticle';
import { GQLTopicQueryTopicFragment } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';

interface Props {
  topic: GQLTopicQueryTopicFragment;
  copyPageUrlLink: string;
  locale: LocaleType;
  modifier: 'clean' | 'in-topic';
  showIngress: boolean;
}

const ArticleContents = ({
  topic,
  copyPageUrlLink,
  locale,
  modifier = 'clean',
  showIngress = true,
}: Props) => {
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  const renderMarkdown = (text: string) => {
    return markdown.render(text);
  };

  if (!topic.article) return null;

  const article = transformArticle(topic.article, locale);

  return (
    <ArticleWrapper modifier={modifier} id={topic.article.id.toString()}>
      {showIngress && (
        <LayoutItem layout="extend">
          <ArticleHeaderWrapper>
            <ArticleIntroduction renderMarkdown={renderMarkdown}>
              {article.introduction}
            </ArticleIntroduction>
          </ArticleHeaderWrapper>
        </LayoutItem>
      )}
      <LayoutItem layout="extend">
        <ArticleContent content={article.content} locale={locale} />
      </LayoutItem>
      <LayoutItem layout="extend">
        {article.metaData?.footnotes?.length && (
          <ArticleFootNotes footNotes={article.metaData?.footnotes} />
        )}
      </LayoutItem>
      <LayoutItem layout="extend">
        <ArticleByline
          licenseBox={<LicenseBox article={article} locale={locale} />}
          copyPageUrlLink={copyPageUrlLink}
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

export default ArticleContents;
