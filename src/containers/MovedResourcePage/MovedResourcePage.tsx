/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { MovedNodeCard } from "../../components/MovedNodeCard";
import { GQLMovedResourcePage_ResourceFragment, GQLMovedResourceQuery } from "../../graphqlTypes";
import { movedResourceQuery } from "../../queries";
import { contentTypeMapping } from "../../util/getContentType";
import handleError from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
    paddingBlock: "medium",
  },
});

interface Props {
  resource: GQLMovedResourcePage_ResourceFragment;
}

const MovedResourcePage = ({ resource }: Props) => {
  const { t } = useTranslation();
  const isLearningpath = !!resource.learningpath;

  const { error, loading, data } = useGraphQuery<GQLMovedResourceQuery>(movedResourceQuery, {
    variables: { resourceId: resource.id },
  });

  const convertResourceToResult = (resource: GQLMovedResourcePage_ResourceFragment) => {
    const resultId = isLearningpath ? resource.learningpath?.id : resource.article?.id;
    if (!resultId) return undefined;

    const ingress = isLearningpath ? resource.learningpath?.description : resource.article?.metaDescription;
    const metaImage = isLearningpath
      ? { url: resource.learningpath?.coverphoto?.url, alt: "" }
      : resource.article?.metaImage;

    return {
      id: resultId,
      title: resource.name,
      url: resource.path ?? "",
      contentType: resource.resourceTypes?.map((type) => contentTypeMapping[type.id]).find((t) => t),
      ingress: ingress ?? "",
      metaImage,
      subjects: data?.resource?.contexts.map(({ breadcrumbs, path }) => ({
        url: path,
        title: breadcrumbs[0] ?? "",
      })),
    };
  };

  if (loading) {
    return null;
  }

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const result = convertResourceToResult(resource);

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.movedResourcePage")} />
      <OneColumn>
        <Wrapper>
          <Heading>
            {result ? t("movedResourcePage.title") : t("searchPage.searchResultListMessages.noResultHeading")}
          </Heading>
          {result ? (
            <MovedNodeCard
              title={result.title}
              contentType={result.contentType}
              url={result.url}
              ingress={result.ingress}
              metaImage={result.metaImage}
              subjects={result.subjects}
            />
          ) : (
            <Text>{t("searchPage.searchResultListMessages.noResultDescription")}</Text>
          )}
        </Wrapper>
      </OneColumn>
    </>
  );
};

MovedResourcePage.fragments = {
  resource: gql`
    fragment MovedResourcePage_Resource on Node {
      id
      name
      path
      paths
      contexts {
        path
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

export default MovedResourcePage;
