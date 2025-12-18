/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ErrorWarningLine } from "@ndla/icons";
import { Heading, Image, MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ImageVariantDTO } from "@ndla/types-backend/image-api";
import { subjectTypes } from "@ndla/ui";
import { groupBy } from "@ndla/util";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { NavigationBox } from "../../components/NavigationBox";
import { PageSpinner } from "../../components/PageSpinner";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { COLLECTION_LANGUAGES, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLCollectionPageQuery, GQLCollectionPageQueryVariables } from "../../graphqlTypes";
import { htmlTitle } from "../../util/titleHelper";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

// TODO: We might want to reconsider this at some point. For now it'll do.
const IMAGE_ID = "67778";

const collectionPageQuery = gql`
  query collectionPage($language: String!, $imageId: String!) {
    subjectCollection(language: $language) {
      id
      name
      url
      metadata {
        customFields
      }
    }
    imageV3(id: $imageId) {
      id
      image {
        imageUrl
        dimensions {
          width
          height
        }
        variants {
          variantUrl
          size
        }
      }
    }
  }
`;

const StyledPageContainer = styled(PageContainer, {
  base: {
    paddingBlockStart: "0",
    gap: "xxlarge",
  },
});

const StyledImage = styled(Image, {
  base: {
    width: "100%",
  },
});

export const CollectionPage = () => {
  const { collectionId } = useParams();
  const isValidLanguage = COLLECTION_LANGUAGES.includes(collectionId ?? "");

  const collectionQuery = useQuery<GQLCollectionPageQuery, GQLCollectionPageQueryVariables>(collectionPageQuery, {
    variables: { language: collectionId!, imageId: IMAGE_ID },
    skip: !isValidLanguage,
  });

  if (collectionQuery.loading) {
    return <PageSpinner />;
  }

  if (!isValidLanguage || !collectionId) {
    return <NotFoundPage />;
  }

  if (!collectionQuery.data) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <CollectionPageContent
      collectionLanguage={collectionId}
      subjects={collectionQuery.data.subjectCollection}
      image={collectionQuery.data.imageV3}
    />
  );
};

interface CollectionpageContentProps {
  collectionLanguage: string;
  subjects: GQLCollectionPageQuery["subjectCollection"];
  image: GQLCollectionPageQuery["imageV3"];
}

const CollectionPageContent = ({ collectionLanguage, subjects, image }: CollectionpageContentProps) => {
  const { t } = useTranslation();

  const metaTitle = useMemo(
    () => t("collectionPage.title", { language: t(`languages.${collectionLanguage}`).toLowerCase() }),
    [collectionLanguage, t],
  );
  const pageTitle = useMemo(() => htmlTitle(metaTitle, [t("htmlTitles.titleTemplate")]), [metaTitle, t]);

  const subjectCategories = useMemo(() => {
    const transformedSubjects = subjects?.map((subject) => ({
      ...subject,
      label: subject.name ?? "",
      url: subject.url,
      metadata: {
        ...subject.metadata,
        customFields: {
          ...subject.metadata.customFields,
          subjectType: subject.metadata.customFields.subjectType ?? subjectTypes.SUBJECT,
        },
      },
    }));
    return Object.entries(groupBy(transformedSubjects, (d) => d.metadata.customFields.subjectType));
  }, [subjects]);

  return (
    <StyledPageContainer padding="large" asChild consumeCss>
      <main>
        <PageTitle title={pageTitle} />
        <SocialMediaMetadata title={metaTitle} imageUrl={image?.image.imageUrl} />
        <div>
          {!!image && (
            <StyledImage
              src={image.image.imageUrl}
              alt=""
              height={image.image.dimensions?.height}
              width={image.image.dimensions?.width}
              variants={image.image.variants as ImageVariantDTO[]}
            />
          )}
          <Heading textStyle="heading.medium" id={SKIP_TO_CONTENT_ID}>
            {t("collectionPage.title", { language: t(`languages.${collectionLanguage}`).toLowerCase() })}
          </Heading>
        </div>
        {subjectCategories.length ? (
          subjectCategories.map(([category, items]) => (
            <NavigationBox key={category} heading={t(`subjectTypes.${category}`)} items={items} />
          ))
        ) : (
          <MessageBox variant="warning">
            <ErrorWarningLine /> {t("collectionPage.noSubjects")}
          </MessageBox>
        )}
      </main>
    </StyledPageContainer>
  );
};

export const Component = CollectionPage;
