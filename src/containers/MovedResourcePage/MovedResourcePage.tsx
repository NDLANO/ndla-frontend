/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Badge, CardContent, CardHeading, CardImage, CardRoot, Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer } from "@ndla/ui";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { NavigationBox } from "../../components/NavigationBox";
import { PageTitle } from "../../components/PageTitle";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLMovedResourcePage_NodeFragment, GQLMovedResourceQuery } from "../../graphqlTypes";
import { useListItemTraits } from "../../util/listItemTraits";

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

const StyledCardRoot = styled(CardRoot, {
  base: {
    height: "100%",
    width: "360px",
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

  const { error, loading, data } = useQuery<GQLMovedResourceQuery>(movedResourceQuery, {
    variables: { resourceId: resource.id },
  });

  const traits = useListItemTraits({
    resourceTypes: resource.resourceTypes,
    traits: resource.article?.traits,
  });

  if (loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessagePage />;
  }

  const resourceId = resource.learningpath?.id ?? resource.article?.id;
  const ingress = resource.learningpath?.description ?? resource.article?.metaDescription ?? "";
  const image = resource.learningpath?.coverphoto ?? resource.article?.metaImage;

  const navigationBoxItems = data?.resource?.contexts.map((ctx) => {
    return { url: ctx.url ?? "", label: ctx.breadcrumbs[0] ?? "" };
  });

  return (
    <PageContainer>
      <PageTitle title={t("htmlTitles.movedResourcePage")} />
      <meta name="robots" content="noindex" />
      <StyledMain>
        <StyledHeading id={SKIP_TO_CONTENT_ID} textStyle="heading.large">
          {resourceId ? t("movedResourcePage.title") : t("searchPage.searchResultListMessages.noResultHeading")}
        </StyledHeading>
        {resourceId ? (
          <StyledCardRoot>
            {!!image && <CardImage alt={image.alttext.alttext} src={image.image.imageUrl} />}
            <CardContent>
              <CardHeading asChild consumeCss>
                <SafeLink to={resource.url ?? ""} unstyled css={linkOverlay.raw()}>
                  {resource.name}
                </SafeLink>
              </CardHeading>
              {!!ingress && <Text>{parse(ingress)}</Text>}
              {!!resource.breadcrumbs && (
                <Text color="text.subtle" textStyle="label.small">
                  {resource.breadcrumbs.join(" › ")}
                </Text>
              )}
              <BadgesContainer>
                {traits.map((trait) => (
                  <Badge size="small" key={trait}>
                    {trait}
                  </Badge>
                ))}
              </BadgesContainer>
            </CardContent>
          </StyledCardRoot>
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
      nodeType
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
        traits
        metaImage {
          image {
            imageUrl
          }
          alttext {
            alttext
          }
        }
      }
      learningpath {
        id
        description
        coverphoto {
          image {
            imageUrl
          }
          alttext {
            alttext
          }
        }
      }
      resourceTypes {
        id
        name
      }
    }
  `,
};
