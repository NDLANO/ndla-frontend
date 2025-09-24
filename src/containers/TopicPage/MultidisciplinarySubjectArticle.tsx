/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
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
import { NoSSR } from "@ndla/util";
import Article from "../../components/Article";
import { useArticleCopyText, useNavigateToHash } from "../../components/Article/articleHelpers";
import FavoriteButton from "../../components/Article/FavoritesButton";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import LicenseBox from "../../components/license/LicenseBox";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { SubjectLinkSet } from "../../components/Subject/SubjectLinks";
import config from "../../config";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLMultidisciplinarySubjectArticle_NodeFragment } from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import Resources from "../Resources/Resources";

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

const StyledArticleContent = styled(ArticleContent, {
  base: {
    overflowX: "visible",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    overflowX: "clip",
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

const Divider = styled("div", {
  base: {
    width: "100%",
    borderBottom: "1px solid",
    borderColor: "stroke.default",
    paddingBlockStart: "xsmall",
  },
});

interface Props {
  node: GQLMultidisciplinarySubjectArticle_NodeFragment;
}

const MultidisciplinarySubjectArticle = ({ node }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const crumbs = useMemo(() => node.context?.parents ?? [], [node]);
  const root = crumbs[0];

  const metaTitle = useMemo(
    () => htmlTitle(node.article?.title ?? node.name, [root?.name]),
    [node.article?.title, node.name, root?.name],
  );
  const pageTitle = useMemo(() => htmlTitle(metaTitle, [t("htmlTitles.titleTemplate")]), [metaTitle, t]);

  useEffect(() => {
    if (!node?.article || !authContextLoaded) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: pageTitle,
    });
  }, [authContextLoaded, node.article, trackPageView, user, pageTitle]);

  const breadCrumbs = useMemo(() => {
    return toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, node]);
  }, [t, node, crumbs]);

  const [article, scripts] = useMemo(() => {
    if (!node.article) return [undefined, undefined];
    return [
      transformArticle(node.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${node.article.id}`,
        subject: root?.id,
        articleLanguage: node.article.language,
      }),
      getArticleScripts(node.article, i18n.language),
    ];
  }, [node.article, i18n.language, root?.id]);

  const copyText = useArticleCopyText(article);

  useNavigateToHash(article?.transformedContent.content);

  if (!node.article || !article) {
    return null;
  }

  const subjectLinks = node.article.crossSubjectTopics?.map((crossSubjectTopic) => ({
    name: crossSubjectTopic.title,
    url: crossSubjectTopic.url || root?.url || "",
  }));

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, article.language, undefined);

  const socialMediaMetaData = {
    title: metaTitle,
    description: node.article?.metaDescription ?? node.article?.introduction,
    image: node.article?.metaImage,
  };

  return (
    <StyledPageContent variant="article" asChild consumeCss>
      <main>
        {scripts?.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
        {!node.context?.isActive && <meta name="robots" content="noindex" />}
        <title>{pageTitle}</title>
        <SocialMediaMetadata
          title={socialMediaMetaData.title}
          description={socialMediaMetaData.description}
          imageUrl={socialMediaMetaData.image?.url}
          trackableContent={{
            supportedLanguages: node.article?.supportedLanguages,
          }}
        />
        <HeaderWrapper>
          <HomeBreadcrumb items={breadCrumbs} />
          {!!subjectLinks?.length && (
            <SubjectLinkSet
              set="test"
              title={t("multidisciplinarySubject.subjectsLinksDescription")}
              subjects={subjectLinks}
            />
          )}
          <Divider />
        </HeaderWrapper>
        <PageContent variant="content" gutters="never" asChild>
          <ArticleWrapper {...licenseProps}>
            <ArticleTitle
              id={SKIP_TO_CONTENT_ID}
              title={article.transformedContent.title}
              introduction={article.transformedContent.introduction}
              contentTypeLabel={node.resourceTypes?.[0]?.name}
              competenceGoals={
                !!article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length && (
                  <CompetenceGoals
                    codes={article.grepCodes}
                    subjectId={root?.id}
                    supportedLanguages={article.supportedLanguages}
                  />
                )
              }
              lang={article.language}
              heartButton={
                !!node.url &&
                !!article.id && (
                  <AddResourceToFolderModal
                    resource={{
                      id: `${article.id}`,
                      path: node.url,
                      resourceType: "multidisciplinary",
                    }}
                  >
                    <FavoriteButton path={node.url} />
                  </AddResourceToFolderModal>
                )
              }
              contentType="multidisciplinary"
            />
            <StyledArticleContent>{article.transformedContent.content ?? ""}</StyledArticleContent>
            <ArticleFooter>
              <ArticleByline
                footnotes={article.transformedContent.metaData?.footnotes ?? []}
                authors={authors}
                suppliers={article.copyright?.rightsholders}
                published={article.published}
                licenseBox={<LicenseBox article={article} copyText={copyText} oembed={article.oembed} />}
              />
              <NoSSR fallback={null}>
                <ResourcesPageContent>
                  <Resources parentId={node.id} rootId={node.context?.rootId} headingType="h2" subHeadingType="h3" />
                </ResourcesPageContent>
              </NoSSR>
            </ArticleFooter>
          </ArticleWrapper>
        </PageContent>
      </main>
    </StyledPageContent>
  );
};

MultidisciplinarySubjectArticle.fragments = {
  node: gql`
    fragment MultidisciplinarySubjectArticle_Node on Node {
      id
      name
      url
      context {
        contextId
        rootId
        breadcrumbs
        url
        isActive
        parents {
          contextId
          id
          name
          url
        }
      }
      resourceTypes {
        id
        name
      }
      article {
        id
        language
        created
        updated
        oembed
        introduction
        metaDescription
        metaImage {
          url
          alt
        }
        crossSubjectTopics(subjectId: $rootId) {
          title
          path
          url
        }
        ...Article_Article
      }
    }
    ${Article.fragments.article}
  `,
};

export default MultidisciplinarySubjectArticle;
