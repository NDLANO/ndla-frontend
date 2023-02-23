/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from 'react';
import { Remarkable } from 'remarkable';
import { gql } from '@apollo/client';
import {
  ArticleWrapper,
  LayoutItem,
  ArticleHeaderWrapper,
  ArticleIntroduction,
  ArticleByline,
  ArticleContent,
  ArticleFootNotes,
} from '@ndla/ui';

import { useTranslation } from 'react-i18next';
import LicenseBox from '../license/LicenseBox';
import { transformArticle } from '../../util/transformArticle';
import { GQLArticleContents_TopicFragment } from '../../graphqlTypes';
import config from '../../config';
import { useDisableConverter } from '../ArticleConverterContext';
import { getArticleScripts } from '../../util/getArticleScripts';

interface Props {
  topic: GQLArticleContents_TopicFragment;
  modifier: 'clean' | 'in-topic';
  showIngress: boolean;
  subjectId?: string;
}

const ArticleContents = ({
  topic,
  modifier = 'clean',
  showIngress = true,
  subjectId,
}: Props) => {
  const { i18n } = useTranslation();
  const disableConverter = useDisableConverter();
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);

  const renderMarkdown = (text: string) => {
    return markdown.render(text);
  };

  const [article, scripts] = useMemo(() => {
    if (!topic.article) return [undefined, undefined];
    return [
      transformArticle(topic.article, i18n.language, {
        enabled: disableConverter,
        path: `${config.ndlaFrontendDomain}/article/${topic.article?.id}`,
        subject: subjectId,
      }),
      getArticleScripts(topic.article, i18n.language),
    ];
  }, [disableConverter, i18n.language, subjectId, topic.article]);

  if (!topic.article || !article) return null;

  return (
    <ArticleWrapper modifier={modifier} id={topic.article.id.toString()}>
      {scripts?.map(script => (
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
            <ArticleIntroduction renderMarkdown={renderMarkdown}>
              {article.introduction}
            </ArticleIntroduction>
          </ArticleHeaderWrapper>
        </LayoutItem>
      )}
      <LayoutItem layout="extend">
        {!disableConverter ? (
          <ArticleContent content={article.content} locale={i18n.language} />
        ) : (
          article.content
        )}
      </LayoutItem>
      <LayoutItem layout="extend">
        {article.metaData?.footnotes?.length ? (
          <ArticleFootNotes footNotes={article.metaData?.footnotes} />
        ) : (
          undefined
        )}
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
  topic: gql`
    fragment ArticleContents_Topic on Topic {
      article(convertEmbeds: $convertEmbeds) {
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
    }
    ${LicenseBox.fragments.article}
  `,
};

export default ArticleContents;
