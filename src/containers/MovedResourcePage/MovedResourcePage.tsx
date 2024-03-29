/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import { HelmetWithTracker } from "@ndla/tracker";
import { SearchResultList, OneColumn } from "@ndla/ui";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { GQLMovedResourcePage_ResourceFragment, GQLMovedResourceQuery } from "../../graphqlTypes";
import { movedResourceQuery } from "../../queries";
import { contentTypeMapping } from "../../util/getContentType";
import handleError from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";
import { resultsWithContentTypeBadgeAndImage } from "../SearchPage/searchHelpers";

interface Props {
  resource: GQLMovedResourcePage_ResourceFragment;
}

const StyledSearchResultListWrapper = styled.div`
  padding-bottom: ${spacing.medium};
  margin-bottom: ${spacing.large};
  border: 1px solid ${colors.brand.greyLight};
  ${mq.range({ from: breakpoints.desktop })} {
    padding: ${spacing.medium};
  }
`;

const MovedResourcePage = ({ resource }: Props) => {
  const { t } = useTranslation();
  const isLearningpath = !!resource.learningpath;

  const { error, loading, data } = useGraphQuery<GQLMovedResourceQuery>(movedResourceQuery, {
    variables: { resourceId: resource.id },
  });

  const convertResourceToResult = (resource: GQLMovedResourcePage_ResourceFragment) => {
    const resultId = isLearningpath ? resource.learningpath?.id : resource.article?.id;
    if (!resultId) return [];
    return [
      {
        title: resource.name,
        url: resource.path ?? "",
        contentType: resource.resourceTypes?.map((type) => contentTypeMapping[type.id]).find((t) => t),
        type: resource.resourceTypes?.find((type) => !contentTypeMapping[type.id])?.name,
        subjects: data?.resource?.contexts.map(({ breadcrumbs, path }) => ({
          url: path,
          title: breadcrumbs[0] ?? "",
          breadcrumb: breadcrumbs,
        })),
        ...(isLearningpath
          ? {
              id: resultId,
              ingress: resource?.learningpath?.description ?? "",
              metaImage: {
                url: resource.learningpath?.coverphoto?.url,
                alt: "",
              },
            }
          : {
              id: resultId,
              ingress: resource?.article?.metaDescription ?? "",
              metaImage: {
                url: resource.article?.metaImage?.url,
                alt: resource.article?.metaImage?.alt,
              },
            }),
      },
    ];
  };

  if (loading) {
    return null;
  }

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const results = resultsWithContentTypeBadgeAndImage(convertResourceToResult(resource), t);

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.movedResourcePage")} />
      <OneColumn>
        <h1>{t("movedResourcePage.title")}</h1>
        <StyledSearchResultListWrapper>
          <SearchResultList results={results} />
        </StyledSearchResultListWrapper>
      </OneColumn>
    </>
  );
};

MovedResourcePage.fragments = {
  resource: gql`
    fragment MovedResourcePage_Resource on Resource {
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
