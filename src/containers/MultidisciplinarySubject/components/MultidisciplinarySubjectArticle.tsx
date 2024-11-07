/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { Divider, styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import {
  ArticleByline,
  ArticleContent,
  ArticleFooter,
  ArticleTitle,
  ArticleWrapper,
  HomeBreadcrumb,
  licenseAttributes,
} from "@ndla/ui";
import Article from "../../../components/Article";
import { useArticleCopyText, useNavigateToHash } from "../../../components/Article/articleHelpers";
import { AuthContext } from "../../../components/AuthenticationContext";
import CompetenceGoals from "../../../components/CompetenceGoals";
import LicenseBox from "../../../components/license/LicenseBox";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import { SubjectLinkSet } from "../../../components/Subject/SubjectLinks";
import config from "../../../config";
import {
  GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment,
  GQLMultidisciplinarySubjectArticle_RootNodeFragment,
  GQLMultidisciplinarySubjectArticle_ParentNodeFragment,
} from "../../../graphqlTypes";
import { toBreadcrumbItems } from "../../../routeHelpers";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import { transformArticle } from "../../../util/transformArticle";
import Resources from "../../Resources/Resources";

const ResourcesPageContent = styled("div", {
  base: {
    position: "relative",
    background: "background.subtle",
    paddingBlock: "xxlarge",
    zIndex: "base",
    _after: {
      content: '""',
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "-100vw",
      right: "-100vw",
      zIndex: "hide",
      background: "inherit",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    overflowX: "hidden",
    paddingBlockStart: "xxlarge",
    gap: "xsmall",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    alignItems: "flex-start",
  },
});

const StyledDivider = styled(Divider, {
  base: {
    paddingBlockStart: "xsmall",
  },
});

interface Props {
  parent: GQLMultidisciplinarySubjectArticle_ParentNodeFragment;
  root: GQLMultidisciplinarySubjectArticle_RootNodeFragment;
  resourceTypes?: GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment[];
  skipToContentId?: string;
}

const MultidisciplinarySubjectArticle = ({ parent, root, resourceTypes, skipToContentId }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { trackPageView } = useTracker();
  const crumbs = useMemo(() => parent.context?.parents ?? [], [parent]);

  useEffect(() => {
    if (!parent?.article || !authContextLoaded) return;
    const dimensions = getAllDimensions({
      article: parent.article,
      filter: root.name,
      user,
    });
    trackPageView({
      dimensions,
      title: htmlTitle(parent.name || "", [t("htmlTitles.titleTemplate")]),
    });
  }, [authContextLoaded, root, t, parent.article, parent.name, parent.path, trackPageView, user]);

  const breadCrumbs = useMemo(() => {
    return toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, parent], enablePrettyUrls);
  }, [t, parent, crumbs, enablePrettyUrls]);

  const [article, scripts] = useMemo(() => {
    if (!parent.article) return [undefined, undefined];
    return [
      transformArticle(parent.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${parent.article.id}`,
        subject: root.id,
        articleLanguage: parent.article.language,
      }),
      getArticleScripts(parent.article, i18n.language),
    ];
  }, [parent.article, i18n.language, root.id]);

  const copyText = useArticleCopyText(article);

  useNavigateToHash(article?.transformedContent.content);

  if (!parent.article || !article) {
    return null;
  }

  const subjectLinks = parent.article.crossSubjectTopics?.map((crossSubjectTopic) => ({
    name: crossSubjectTopic.title,
    path: crossSubjectTopic.path || root.path || "",
  }));

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, article.language, undefined);

  return (
    <StyledPageContent variant="article" asChild consumeCss>
      <main>
        <Helmet>
          {scripts?.map((script) => (
            <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
          ))}
        </Helmet>
        <HeaderWrapper>
          <HomeBreadcrumb items={breadCrumbs} />
          <SubjectLinkSet
            set="test"
            title={t("multidisciplinarySubject.subjectsLinksDescription")}
            subjects={subjectLinks ?? []}
          />
          <StyledDivider thickness="1px" color="stroke.default" />
        </HeaderWrapper>
        <PageContent variant="content" gutters="never" asChild>
          <ArticleWrapper {...licenseProps}>
            <ArticleTitle
              id={skipToContentId ?? article.id.toString()}
              title={article.transformedContent.title}
              introduction={article.transformedContent.introduction}
              contentTypeLabel={parent.resourceTypes?.[0]?.name}
              competenceGoals={
                !!article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length && (
                  <CompetenceGoals
                    codes={article.grepCodes}
                    subjectId={root?.id}
                    supportedLanguages={article.supportedLanguages}
                  />
                )
              }
              lang={article.language === "nb" ? "no" : article.language}
            />
            <ArticleContent>{article.transformedContent.content ?? ""}</ArticleContent>
            <ArticleFooter>
              <ArticleByline
                footnotes={article.transformedContent.metaData?.footnotes ?? []}
                authors={authors}
                suppliers={article.copyright?.rightsholders}
                published={article.published}
                license={article.copyright?.license?.license ?? ""}
                licenseBox={<LicenseBox article={article} copyText={copyText} oembed={article.oembed} />}
              />
              <ResourcesPageContent>
                <Resources topic={parent} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />
              </ResourcesPageContent>
            </ArticleFooter>
          </ArticleWrapper>
        </PageContent>
      </main>
    </StyledPageContent>
  );
};

export const multidisciplinarySubjectArticleFragments = {
  parent: gql`
    fragment MultidisciplinarySubjectArticle_ParentNode on Node {
      id
      name
      path
      url
      context {
        contextId
        breadcrumbs
        parentIds
        path
        url
        parents {
          contextId
          id
          name
          path
          url
        }
      }
      resourceTypes {
        id
        name
      }
      article {
        created
        updated
        oembed
        crossSubjectTopics(subjectId: $subjectId) {
          title
          path
        }
        ...Article_Article
      }
      ...Resources_Parent
    }
    ${Resources.fragments.parent}
    ${Article.fragments.article}
  `,
  root: gql`
    fragment MultidisciplinarySubjectArticle_RootNode on Node {
      id
      name
      path
      url
      subjectpage {
        id
        about {
          title
        }
      }
    }
  `,
  resourceType: gql`
    fragment MultidisciplinarySubjectArticle_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default MultidisciplinarySubjectArticle;
