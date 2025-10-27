/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { MovedNodeCard } from "../../components/MovedNodeCard";
import { NavigationBox } from "../../components/NavigationBox";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLMovedResourcePage_NodeFragment, GQLMovedResourceQuery } from "../../graphqlTypes";
import { contentTypeMapping } from "../../util/getContentType";

interface Props {
  resource: GQLMovedResourcePage_NodeFragment;
}

const StyledMain = styled("main", {
  base: {
    display: "flex",
    gap: "xxlarge",
    flexDirection: "column",
    alignItems: "center",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    textAlign: "center",
  },
});

const movedResourceQuery = gql`
  query movedResource($resourceId: String!) {
    resource: node(id: $resourceId) {
      contexts {
        contextId
        url
        breadcrumbs
      }
    }
  }
`;

export const MovedResourcePage = ({ resource }: Props) => {
  const { t } = useTranslation();
  const isLearningpath = !!resource.learningpath;

  const { error, loading, data } = useQuery<GQLMovedResourceQuery>(movedResourceQuery, {
    variables: { resourceId: resource.id },
  });

  const convertResourceToResult = (resource: GQLMovedResourcePage_NodeFragment) => {
    const resultId = isLearningpath ? resource.learningpath?.id : resource.article?.id;
    if (!resultId) return undefined;

    const ingress = isLearningpath ? resource.learningpath?.description : resource.article?.metaDescription;
    const metaImage = isLearningpath
      ? { url: resource.learningpath?.coverphoto?.url, alt: "" }
      : resource.article?.metaImage;

    return {
      id: resultId,
      title: resource.name,
      url: resource.url ?? "",
      contentType: resource.resourceTypes?.map((type) => contentTypeMapping[type.id]).find((t) => t),
      ingress: ingress ?? "",
      metaImage,
      breadcrumbs: resource.breadcrumbs,
      roots: data?.resource?.contexts.map(({ breadcrumbs, url }) => ({
        url: url,
        title: breadcrumbs[0] ?? "",
      })),
    };
  };

  if (loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessagePage />;
  }

  const result = convertResourceToResult(resource);
  const navigationBoxItems = result?.roots?.map((root) => ({
    label: root.title ?? "",
    url: root.url ?? "",
  }));

  return (
    <PageContainer>
      <HelmetWithTracker title={t("htmlTitles.movedResourcePage")}>
        <meta name="robots" content="noindex" />
      </HelmetWithTracker>
      <StyledMain>
        <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.large">
          {result ? t("movedResourcePage.title") : t("searchPage.searchResultListMessages.noResultHeading")}
        </StyledHeading>
        {result ? (
          <MovedNodeCard
            title={result.title}
            contentType={result.contentType}
            url={result.url}
            ingress={result.ingress}
            metaImage={result.metaImage}
            breadcrumbs={result.breadcrumbs}
          />
        ) : (
          <Text>{t("searchPage.searchResultListMessages.noResultDescription")}</Text>
        )}
        <NavigationBox heading={t("movedResourcePage.openInSubject")} items={navigationBoxItems} />
      </StyledMain>
    </PageContainer>
  );
};

MovedResourcePage.fragments = {
  resource: gql`
    fragment MovedResourcePage_Node on Node {
      id
      name
      url
      breadcrumbs
      contexts {
        contextId
        url
        breadcrumbs
      }
      article {
        id
        metaDescription
        metaImage {
          url
          alt
        }
      }
      learningpath {
        id
        description
        coverphoto {
          url
        }
      }
      resourceTypes {
        id
        name
      }
    }
  `,
};
